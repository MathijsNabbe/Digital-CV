function parseDate(dateStr) {
    if (!dateStr) return new Date(); // Use current date if missing
    const [month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-01`);
}

function formatMonthYear(dateStr) {
    if (!dateStr) return "Current";
    const [month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-01`).toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
}

function getMonthDiff(startDate, endDate) {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()) + 1;
}

function formatDuration(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (remainingMonths > 0) parts.push(`${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`);
    return parts.join(" ") || "0 months";
}

function getJobRange(jobs) {
    const starts = jobs.map(j => parseDate(j.start));
    const ends = jobs.map(j => parseDate(j.end));
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return {
        start: minStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
        end: maxEnd.toLocaleString('default', { month: 'long', year: 'numeric' }),
        totalMonths: getMonthDiff(minStart, maxEnd)
    };
}

function createCompanyCard(org, locationText, jobs, category) {
    jobs.sort((a, b) => parseDate(a.start) - parseDate(b.start));
    const range = getJobRange(jobs);
    const formattedDuration = formatDuration(range.totalMonths);

    const jobDetails = jobs.map(job => {
        const start = parseDate(job.start);
        const end = parseDate(job.end);
        const monthDiff = getMonthDiff(start, end);
        const durationStr = formatDuration(monthDiff);

        return `
          <div class="mb-3">
            <strong>${job.title}</strong><br/>
            <small class="text-muted">
              ${formatMonthYear(job.start)} – ${formatMonthYear(job.end)} (${durationStr})
            </small><br/>
            <small>${job.type} | ${job.location}</small><br/>
            ${job.description ? `<p class="mb-0">${job.description}</p>` : ''}
          </div>
        `;
    }).join('');

    const card = document.createElement('div');
    card.className = 'timeline-5 right-5';
    card.dataset.category = category;
    card.innerHTML = `
      <div class="card">
        <div class="card-body p-4">
          <h5>${org}</h5>
          <span class="small text-muted">
            <i class="fas fa-clock me-1"></i>
            ${range.start} – ${range.end} · (${formattedDuration})
          </span>
          <p class="mb-1 text-muted"><small>${locationText}</small></p>
          <hr>
          ${jobDetails}
        </div>
      </div>
    `;
    return card;
}

function renderFilters(categories) {
    const filterContainer = document.getElementById('categoryFilters');
    filterContainer.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'btn btn-outline-primary m-1 active';
    allBtn.textContent = 'All';
    allBtn.dataset.category = 'all';
    filterContainer.appendChild(allBtn);

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary m-1';
        btn.textContent = category;
        btn.dataset.category = category;
        filterContainer.appendChild(btn);
    });

    filterContainer.addEventListener('click', (e) => {
        if (!e.target.matches('button[data-category]')) return;

        const selected = e.target.dataset.category;
        document.querySelectorAll('#categoryFilters button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        document.querySelectorAll('#timelineContainer .timeline-5').forEach(card => {
            const cardCategory = card.dataset.category;
            card.style.display = (selected === 'all' || selected === cardCategory) ? '' : 'none';
        });
    });
}

function renderTimeline(data) {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    const categorySet = new Set();
    const companyCards = [];

    data.timeline.forEach(category => {
        const categoryName = category.category;
        categorySet.add(categoryName);

        category.entries.forEach(entry => {
            const locationText = `${entry.city}, ${entry.region}, ${entry.country}`;

            // Sort jobs per company
            entry.jobs.sort((a, b) => parseDate(a.start) - parseDate(b.start));

            // Find latest end date per company
            const latestJob = entry.jobs.reduce((latest, current) =>
                parseDate(current.end) > parseDate(latest.end) ? current : latest
            );
            const latestEndDate = parseDate(latestJob.end);

            // Generate card and save with end date
            const card = createCompanyCard(entry.organization, locationText, entry.jobs, categoryName);
            companyCards.push({ card, latestEndDate });
        });
    });

    // Sort company cards by latest end date (descending)
    companyCards
        .sort((a, b) => b.latestEndDate - a.latestEndDate)
        .forEach(item => container.appendChild(item.card));

    renderFilters([...categorySet]);
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/assets/data/career.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => renderTimeline(data))
        .catch(error => console.error('Failed to load timeline data:', error));
});
