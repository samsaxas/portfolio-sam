// Projects Page Charts
document.addEventListener('DOMContentLoaded', function() {
    // Set Chart.js defaults for dark theme
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.1)';

    // Smooth scrolling for category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Add active class to the clicked button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Scroll to the section with animation
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Check URL hash on page load and scroll to section if needed
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Highlight the corresponding button
                const activeButton = document.querySelector(`.category-btn[href="${window.location.hash}"]`);
                if (activeButton) {
                    activeButton.classList.add('active');
                }
            }, 300);
        }
    }

    // Add animation to project cards on scroll
    const projectCards = document.querySelectorAll('.card');

    function checkCardVisibility() {
        projectCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.8;

            if (cardTop < triggerPoint) {
                card.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }

    // Initial check
    checkCardVisibility();

    // Check on scroll
    window.addEventListener('scroll', checkCardVisibility);

    // Customer Retention Chart
    const retentionCtx = document.getElementById('retentionChart');
    if (retentionCtx) {
        const retentionChart = new Chart(retentionCtx, {
            type: 'doughnut',
            data: {
                labels: [
                    'High Value',
                    'Regular',
                    'Occasional',
                    'At Risk'
                ],
                datasets: [{
                    data: [42, 28, 18, 12],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(13, 110, 253, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgb(40, 167, 69)',
                        'rgb(13, 110, 253)',
                        'rgb(255, 193, 7)',
                        'rgb(220, 53, 69)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Project Success Metrics Chart
    const projectMetricsCtx = document.getElementById('projectMetricsChart');
    if (projectMetricsCtx) {
        const projectMetricsChart = new Chart(projectMetricsCtx, {
            type: 'bar',
            data: {
                labels: ['Data Cleaning', 'Analysis', 'Visualization', 'Reporting', 'Implementation'],
                datasets: [{
                    label: 'Time Spent (hours)',
                    data: [24, 40, 32, 18, 12],
                    backgroundColor: 'rgba(13, 110, 253, 0.7)',
                    borderColor: 'rgb(13, 110, 253)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Project Phase'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Sales Trend Chart
    const salesTrendCtx = document.getElementById('salesTrendChart');
    if (salesTrendCtx) {
        const salesTrendChart = new Chart(salesTrendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: '2023 Sales',
                    data: [65, 59, 80, 81, 56, 55, 72, 78, 82, 90, 95, 110],
                    fill: false,
                    borderColor: 'rgb(13, 110, 253)',
                    tension: 0.1
                }, {
                    label: '2022 Sales',
                    data: [45, 52, 60, 65, 51, 49, 62, 69, 75, 80, 85, 95],
                    fill: false,
                    borderColor: 'rgb(108, 117, 125)',
                    tension: 0.1,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sales (thousands)'
                        }
                    }
                }
            }
        });
    }
});
