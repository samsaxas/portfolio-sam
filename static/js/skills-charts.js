// Skills Radar Chart
document.addEventListener('DOMContentLoaded', function() {
    // Set Chart.js defaults for dark theme
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.1)';

    // Data Analysis Skills Chart
    const dataSkillsCtx = document.getElementById('dataSkillsChart');
    if (dataSkillsCtx) {
        const dataSkillsChart = new Chart(dataSkillsCtx, {
            type: 'radar',
            data: {
                labels: [
                    'Pandas & NumPy',
                    'Matplotlib & Seaborn',
                    'PowerBI',
                    'Tableau',
                    'SQL',
                    'Excel'
                ],
                datasets: [{
                    label: 'Proficiency',
                    data: [95, 90, 85, 80, 85, 90],
                    fill: true,
                    backgroundColor: 'rgba(13, 110, 253, 0.3)',
                    borderColor: 'rgb(13, 110, 253)',
                    pointBackgroundColor: 'rgb(13, 110, 253)',
                    pointBorderColor: '#333',
                    pointHoverBackgroundColor: '#333',
                    pointHoverBorderColor: 'rgb(13, 110, 253)'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Machine Learning Skills Chart
    const mlSkillsCtx = document.getElementById('mlSkillsChart');
    if (mlSkillsCtx) {
        const mlSkillsChart = new Chart(mlSkillsCtx, {
            type: 'radar',
            data: {
                labels: [
                    'Scikit-learn',
                    'TensorFlow',
                    'PyTorch',
                    'NLP',
                    'Computer Vision',
                    'Time Series'
                ],
                datasets: [{
                    label: 'Proficiency',
                    data: [90, 80, 75, 85, 80, 85],
                    fill: true,
                    backgroundColor: 'rgba(23, 162, 184, 0.3)',
                    borderColor: 'rgb(23, 162, 184)',
                    pointBackgroundColor: 'rgb(23, 162, 184)',
                    pointBorderColor: '#333',
                    pointHoverBackgroundColor: '#333',
                    pointHoverBorderColor: 'rgb(23, 162, 184)'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Big Data Skills Chart
    const bigDataSkillsCtx = document.getElementById('bigDataSkillsChart');
    if (bigDataSkillsCtx) {
        const bigDataSkillsChart = new Chart(bigDataSkillsCtx, {
            type: 'radar',
            data: {
                labels: [
                    'SQL Databases',
                    'NoSQL Databases',
                    'Hadoop',
                    'Spark',
                    'AWS',
                    'Azure'
                ],
                datasets: [{
                    label: 'Proficiency',
                    data: [85, 75, 70, 75, 80, 70],
                    fill: true,
                    backgroundColor: 'rgba(40, 167, 69, 0.3)',
                    borderColor: 'rgb(40, 167, 69)',
                    pointBackgroundColor: 'rgb(40, 167, 69)',
                    pointBorderColor: '#333',
                    pointHoverBackgroundColor: '#333',
                    pointHoverBorderColor: 'rgb(40, 167, 69)'
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
});
