// Create animated particles for the background
document.addEventListener('DOMContentLoaded', function() {
    // Create particles
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Clear existing particles
        document.querySelector('.bg-particles').innerHTML = '';
        // Create new particles
        createParticles();
    }, 250));
    
    function createParticles() {
        const particleCount = Math.min(window.innerWidth / 10, 50); // Responsive particle count
        const bgParticles = document.querySelector('.bg-particles');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 8 + 4; // 4-12px
            const duration = Math.random() * 20 + 10; // 10-30s
            const startPosition = Math.random() * 100; // 0-100%
            const drift = (Math.random() - 0.5) * 200; // -100px to 100px
            const delay = Math.random() * duration;
            const opacity = Math.random() * 0.6 + 0.4; // 0.4-1.0
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startPosition}%`;
            particle.style.bottom = '-20px';
            particle.style.setProperty('--duration', `${duration}s`);
            particle.style.setProperty('--drift', `${drift}px`);
            particle.style.setProperty('--opacity', opacity);
            particle.style.animationDelay = `${delay}s`;
            
            // Add to container
            bgParticles.appendChild(particle);
        }
    }
    
    // Debounce function to limit how often a function is called
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
});