from flask import Flask, render_template, send_from_directory, send_file, request, redirect, url_for, flash
import json
import os
import logging
import secrets
import re
import time
from datetime import datetime
from flask_wtf.csrf import CSRFProtect
from functools import wraps
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Import configuration
from config import EMAIL_CONFIG, SECURITY_CONFIG, APP_CONFIG

# Configure logging
logging.basicConfig(
    level=getattr(logging, APP_CONFIG['LOG_LEVEL']),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Set secret key from environment variable or configuration
app.secret_key = os.environ.get('FLASK_SECRET_KEY', SECURITY_CONFIG['SECRET_KEY'])

# Mail configuration
app.config['MAIL_SERVER'] = EMAIL_CONFIG['SMTP_SERVER']
app.config['MAIL_PORT'] = EMAIL_CONFIG['SMTP_PORT']
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = EMAIL_CONFIG['EMAIL_ADDRESS']
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_APP_PASSWORD', EMAIL_CONFIG['EMAIL_PASSWORD'])
app.config['MAIL_DEFAULT_SENDER'] = EMAIL_CONFIG['EMAIL_ADDRESS']
mail = Mail(app)

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Dictionary to store IP addresses and their last request timestamps for rate limiting
request_history = {}

# Rate limiting decorator
def rate_limit():
    max_requests = SECURITY_CONFIG['RATE_LIMIT_MAX_REQUESTS']
    window = SECURITY_CONFIG['RATE_LIMIT_WINDOW']

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip = request.remote_addr
            current_time = time.time()

            # Clean up old entries
            for stored_ip in list(request_history.keys()):
                if current_time - request_history[stored_ip]['timestamp'] > window:
                    del request_history[stored_ip]

            # Check if IP exists in history
            if ip in request_history:
                # Check if max requests exceeded
                if request_history[ip]['count'] >= max_requests:
                    # Check if window has passed
                    if current_time - request_history[ip]['timestamp'] < window:
                        logger.warning(f"Rate limit exceeded for IP: {ip}")
                        flash('Too many requests. Please try again later.', 'danger')
                        return redirect(url_for('contact'))
                    else:
                        # Reset if window has passed
                        request_history[ip] = {'count': 1, 'timestamp': current_time}
                else:
                    # Increment count
                    request_history[ip]['count'] += 1
            else:
                # Add new IP to history
                request_history[ip] = {'count': 1, 'timestamp': current_time}

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Email validation function
def is_valid_email(email):
    """More robust email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Check for honeypot field
def is_bot(honeypot_value):
    """Check if form was filled by a bot"""
    return honeypot_value

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/education')
def education():
    return render_template('education.html')

def send_notification_email(name, sender_email, subject, message):
    """
    Send a notification email to the portfolio owner
    """
    try:
        # Create and send the notification email
        email_body = f"""
        You have received a new message from your portfolio website:

        Name: {name}
        Email: {sender_email}
        Subject: {subject}

        Message:
        {message}

        Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """

        msg = Message(
            subject=f"Portfolio Contact: {subject}",
            recipients=[app.config['MAIL_USERNAME']],
            body=email_body,
            reply_to=sender_email
        )
        
        mail.send(msg)
        logger.info(f"Notification email sent to {app.config['MAIL_USERNAME']}")
        return True
    except Exception as e:
        logger.error(f"Error sending notification email: {str(e)}")
        return False

def send_confirmation_email(name, sender_email, subject, message):
    """
    Send a confirmation email to the person who submitted the form
    """
    try:
        # Create and send confirmation email
        email_body = f"""
        Dear {name},

        Thank you for contacting me through my portfolio website. I have received your message and will get back to you as soon as possible.

        Here is a copy of your message:

        Subject: {subject}

        Message:
        {message}

        Best regards,
        Samriddhi Saxena
        Data Analyst | Data Scientist
        """

        msg = Message(
            subject="Confirmation: Your message has been received",
            recipients=[sender_email],
            body=email_body
        )
        
        mail.send(msg)
        logger.info(f"Confirmation email sent to {sender_email}")
        return True
    except Exception as e:
        logger.error(f"Error sending confirmation email: {str(e)}")
        return False

def send_email(name, sender_email, subject, message):
    """
    Send both notification and confirmation emails
    """
    # Send notification to portfolio owner
    notification_sent = send_notification_email(name, sender_email, subject, message)

    # Send confirmation to sender
    confirmation_sent = send_confirmation_email(name, sender_email, subject, message)

    # Return True only if both emails were sent successfully
    return notification_sent and confirmation_sent

@app.route('/contact', methods=['GET', 'POST'])
@rate_limit()  # Use rate limit settings from config
def contact():
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        honeypot = request.form.get('website', '')  # Honeypot field

        # Log the submission attempt (without sensitive data)
        logger.info(f"Contact form submission attempt from IP: {request.remote_addr}")

        # Check if it's a bot using the honeypot field
        if is_bot(honeypot):
            logger.warning(f"Bot detected from IP: {request.remote_addr}")
            # Pretend success but don't process
            flash('Your message has been sent successfully!', 'success')
            return redirect(url_for('contact'))

        # Validate form data
        if not all([name, email, subject, message]):
            flash('Please fill out all fields', 'danger')
            return redirect(url_for('contact'))

        # More robust email validation
        if not is_valid_email(email):
            flash('Please enter a valid email address', 'danger')
            return redirect(url_for('contact'))

        # Basic content validation and sanitization
        if len(message) < 10:
            flash('Your message is too short. Please provide more details.', 'danger')
            return redirect(url_for('contact'))

        if len(message) > 5000:
            flash('Your message is too long. Please keep it under 5000 characters.', 'danger')
            return redirect(url_for('contact'))

        # Send email with retry mechanism
        max_retries = EMAIL_CONFIG['MAX_RETRIES']
        for attempt in range(max_retries):
            try:
                if send_email(name, email, subject, message):
                    logger.info(f"Email sent successfully for {email}")
                    flash('Your message has been sent successfully! A confirmation email has been sent to your address.', 'success')
                    break
                else:
                    if attempt == max_retries - 1:  # Last attempt
                        logger.error(f"Failed to send email after {max_retries} attempts")
                        flash('There was an error sending your message. Please try again later.', 'danger')
            except Exception as e:
                logger.error(f"Error in contact form (attempt {attempt+1}): {str(e)}")
                if attempt == max_retries - 1:  # Last attempt
                    flash('An unexpected error occurred. Please try again later.', 'danger')
                time.sleep(EMAIL_CONFIG['RETRY_DELAY'])  # Wait before retrying

        return redirect(url_for('contact'))

    return render_template('contact.html')

@app.route('/download-resume')
def download_resume():
    # Path to your resume file
    resume_path = os.path.join(app.static_folder, 'files', 'resume.pdf')

    # Check if file exists, if not, create a placeholder
    if not os.path.exists(resume_path):
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(resume_path), exist_ok=True)

        # If you don't have a resume.pdf yet, you can uncomment this to create a placeholder
        # with open(resume_path, 'w') as f:
        #     f.write("Placeholder for resume")

    # Return the file with the correct MIME type
    return send_file(resume_path,
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name='Samriddhi_Saxena_Resume.pdf')

if __name__ == '__main__':
    app.run(debug=APP_CONFIG['DEBUG'])
