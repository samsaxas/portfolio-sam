# Configuration settings for the portfolio application

# Email configuration
EMAIL_CONFIG = {
    # Your Gmail address
    'EMAIL_ADDRESS': 'samriddhisaxena3101@gmail.com',

    # Your Gmail app password (replace with your actual app password)
    'EMAIL_PASSWORD': 'development_password',  # Placeholder for development

    # SMTP server settings for Gmail
    'SMTP_SERVER': 'smtp.gmail.com',
    'SMTP_PORT': 587,

    # Email sending options
    'MAX_RETRIES': 3,
    'RETRY_DELAY': 1,  # seconds
}

# Security configuration
SECURITY_CONFIG = {
    # Secret key for session and CSRF protection
    'SECRET_KEY': 'development_secret_key_123',

    # Rate limiting
    'RATE_LIMIT_MAX_REQUESTS': 5,
    'RATE_LIMIT_WINDOW': 60,  # seconds
}

# Application configuration
APP_CONFIG = {
    # Debug mode (set to False in production)
    'DEBUG': True,

    # Logging level
    'LOG_LEVEL': 'INFO',
}