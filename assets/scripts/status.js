// Function to get current jobs (those without an end date)
function getCurrentJobs(data) {
    const currentJobs = [];

    // Loop through the data and find jobs with no end date (Current jobs)
    data.timeline.forEach(category => {
        category.entries.forEach(entry => {
            // Check if jobs array exists before accessing it
            if (entry.jobs && Array.isArray(entry.jobs)) {
                entry.jobs.forEach(job => {
                    if (!job.end || job.end.trim() === "") { // No end date
                        currentJobs.push({
                            title: job.title,
                            organization: entry.organization
                        });
                    }
                });
            }
        });
    });

    return currentJobs;
}

// Function to render the current jobs in the status block
function renderCurrentJobs(currentJobs) {
    const currentJobsContainer = document.getElementById('currentJobsList');
    currentJobsContainer.innerHTML = '';

    if (currentJobs.length === 0) {
        currentJobsContainer.innerHTML = "<p>No current jobs available.</p>";
    } else {
        currentJobs.forEach(job => {
            const jobItem = document.createElement('div');
            jobItem.classList.add('current-job-item');
            jobItem.innerHTML = `
                <strong>${job.title}</strong> at ${job.organization}
            `;
            currentJobsContainer.appendChild(jobItem);
        });
    }
}

// Function to initialize and render the status block
function initializeStatusBlock(data) {
    // Get current jobs from the timeline data
    const currentJobs = getCurrentJobs(data);

    // Render the current jobs in the status block
    renderCurrentJobs(currentJobs);
}

// Fetch and load the JSON data
document.addEventListener('DOMContentLoaded', () => {
    fetch('/assets/data/career.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => initializeStatusBlock(data))  // Call the function to render status block
        .catch(error => console.error('Failed to load timeline data:', error));
});
