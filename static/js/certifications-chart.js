// Certifications Chart
document.addEventListener('DOMContentLoaded', function() {
    // Check if the chart container exists
    const chartContainer = document.getElementById('certifications-chart');
    if (!chartContainer) return;

    // Certification data
    const certificationData = {
        labels: ['Data Analysis', 'Machine Learning', 'Data Visualization', 'Python', 'Statistics'],
        datasets: [{
            label: 'Skills Coverage in Certifications',
            data: [90, 85, 95, 92, 80],
            backgroundColor: [
                'rgba(13, 110, 253, 0.7)',
                'rgba(32, 201, 151, 0.7)',
                'rgba(220, 53, 69, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(111, 66, 193, 0.7)'
            ],
            borderColor: [
                'rgb(13, 110, 253)',
                'rgb(32, 201, 151)',
                'rgb(220, 53, 69)',
                'rgb(255, 193, 7)',
                'rgb(111, 66, 193)'
            ],
            borderWidth: 1
        }]
    };

    // Create radar chart
    const certChart = new Chart(chartContainer, {
        type: 'radar',
        data: certificationData,
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        color: '#F5F5F5',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: '#F5F5F5'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#F5F5F5',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.2
                }
            }
        }
    });

    // Create certification timeline data
    const timelineData = {
        labels: ['Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024'],
        datasets: [{
            label: 'Certifications Timeline',
            data: [1, 2, 3, 4, 5],
            backgroundColor: 'rgba(13, 110, 253, 0.7)',
            borderColor: 'rgb(13, 110, 253)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(13, 110, 253)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(13, 110, 253)',
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    // Add animation to certification cards
    const certCards = document.querySelectorAll('.certification-card');
    
    function checkCardVisibility() {
        certCards.forEach(card => {
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
});
