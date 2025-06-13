// Experience Timeline Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Check if the timeline container exists
    const timelineContainer = document.getElementById('experience-timeline-viz');
    if (!timelineContainer) return;

    // Experience data - in chronological order (oldest first)
    const experiences = [
        {
            title: "Machine Learning Intern",
            company: "Compsoft Technologies",
            startDate: "2023-09-01",
            endDate: "2023-12-31",
            description: "Engineered machine learning solutions for real-world problems, reducing costs by 80%.",
            skills: ["Python", "Machine Learning", "Computer Vision", "Data Analysis"],
            color: "#1e8a3b" // Green to match reference
        },
        {
            title: "Data Visualization Intern",
            company: "Infosys",
            startDate: "2024-12-01",
            endDate: "2025-01-31",
            description: "Implemented PowerBI and Python Streamlit to automate data aggregation, analysis, and visualization.",
            skills: ["Python", "PowerBI", "Streamlit", "Data Analysis"],
            color: "#0e6b8c" // Blue to match reference
        },
        {
            title: "Data Science",
            company: "Infosys",
            startDate: "2025-05-01",
            endDate: "2025-07-31",
            description: "Infosys Pragati: Path to Future Cohort is a program by Infosys, for women.",
            skills: ["Python", "Data Science", "Machine Learning", "Data Analysis"],
            color: "#b5338a" // Purple to match reference
        }
    ];

    // Set up SVG dimensions
    const margin = {top: 20, right: 20, bottom: 60, left: 20};
    const width = timelineContainer.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select('#experience-timeline-viz').html('');

    // Create SVG element
    const svg = d3.select('#experience-timeline-viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set background color to match the reference image
    d3.select('#experience-timeline-viz')
        .style('background-color', '#a8d0f0');

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    experiences.forEach(d => {
        d.startDateObj = parseDate(d.startDate);
        d.endDateObj = parseDate(d.endDate);
    });

    // Set up scales with fixed domain to match reference image
    // Fixed time range from Sep 2023 to Jul 2025
    const startDate = new Date(2023, 8, 1); // Sep 2023
    const endDate = new Date(2025, 6, 31); // Jul 2025

    const xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width]);

    // Create x-axis with monthly ticks
    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d => {
            const date = new Date(d);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month}\n${year}`;
        })
        .tickSize(5);

    // Add x-axis with styling
    const xAxisGroup = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    // Style the x-axis to match reference image
    xAxisGroup.selectAll('text')
        .style('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('fill', '#000')
        .style('font-size', '10px');

    xAxisGroup.selectAll('line')
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

    xAxisGroup.select('.domain')
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

    // Add vertical grid lines
    svg.selectAll('grid-line')
        .data(xScale.ticks(d3.timeMonth.every(1)))
        .enter()
        .append('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3);

    // Calculate box dimensions - increased width to accommodate longer text
    const boxWidth = 160;
    const boxHeight = 45;
    const boxY = 15; // Fixed Y position for all boxes

    // Create timeline items
    const timelineItems = svg.selectAll('.timeline-item')
        .data(experiences)
        .enter()
        .append('g')
        .attr('class', 'timeline-item');

    // Add experience boxes
    timelineItems.append('rect')
        .attr('x', d => {
            // Center the box over the middle of the date range
            const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;
            return dateRangeCenter - boxWidth / 2;
        })
        .attr('y', boxY)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', d => d.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

    // Helper function to truncate text if needed
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Add title text - with text truncation to prevent overflow
    timelineItems.append('text')
        .attr('x', d => {
            const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;
            return dateRangeCenter;
        })
        .attr('y', boxY + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', '12px')
        .text(d => truncateText(d.title, 20)); // Limit title length

    // Add company name below title instead of "Intern"
    timelineItems.append('text')
        .attr('x', d => {
            const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;
            return dateRangeCenter;
        })
        .attr('y', boxY + 35)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .text(d => truncateText(d.company, 22)); // Limit company name length

    // Add vertical dashed lines connecting to timeline
    timelineItems.each(function(d) {
        const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;

        // Use the same color as the box
        let lineColor = d.color;

        // Draw multiple dashed lines to match reference image
        const spacing = 15; // Spacing between lines
        for (let i = -1; i <= 1; i++) {
            svg.append('line')
                .attr('x1', dateRangeCenter + (i * spacing))
                .attr('y1', boxY + boxHeight)
                .attr('x2', dateRangeCenter + (i * spacing))
                .attr('y2', height)
                .attr('stroke', lineColor)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5');
        }
    });

    // Make the timeline visualization responsive
    function resizeTimeline() {
        const newWidth = timelineContainer.clientWidth - margin.left - margin.right;
        
        // Update SVG dimensions
        d3.select('#experience-timeline-viz svg')
            .attr('width', newWidth + margin.left + margin.right);
            
        // Update x scale
        xScale.range([0, newWidth]);
        
        // Update x axis
        svg.select('.x-axis').call(xAxis);
        
        // Update positions of all elements
        timelineItems.selectAll('rect')
            .attr('x', d => {
                const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;
                return dateRangeCenter - boxWidth / 2;
            });
            
        timelineItems.selectAll('text')
            .attr('x', d => {
                const dateRangeCenter = xScale(d.startDateObj) + (xScale(d.endDateObj) - xScale(d.startDateObj)) / 2;
                return dateRangeCenter;
            });
    }
    
    // Add resize listener
    window.addEventListener('resize', resizeTimeline);
});