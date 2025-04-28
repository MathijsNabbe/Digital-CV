function parseDate(dateStr) {
    if (!dateStr) return new Date(); // Use current date if missing
    if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 2) {
            const [month, year] = parts;
            return new Date(`${year}-${month}-01`);
        } else if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
    }
    return new Date(dateStr);
}

function formatMonthYear(dateStr) {
    if (!dateStr) return "Current";
    const date = parseDate(dateStr);
    return date.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
}

function formatFullDate(dateStr) {
    const date = parseDate(dateStr);
    return date.toLocaleDateString('en-GB');
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
    const ends = jobs.map(j => parseDate(j.end || null));
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return {
        start: minStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
        end: ends.some(e => !e || e.toString() === new Date().toString()) ? "Current" : maxEnd.toLocaleString('default', { month: 'long', year: 'numeric' }),
        totalMonths: getMonthDiff(minStart, new Date())
    };
}

function createCompanyCard(org, locationText, jobs, category) {
    jobs.sort((a, b) => parseDate(b.start) - parseDate(a.start));
    const range = getJobRange(jobs);
    const formattedDuration = formatDuration(range.totalMonths);

    const jobDetails = jobs.map(job => {
        const start = parseDate(job.start);
        const end = parseDate(job.end || null);
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

function createConferenceCard(entry, category) {
    const dateObj = parseDate(entry.date);

    const card = document.createElement('div');
    card.className = 'timeline-5 right-5';
    card.dataset.category = category;

    card.innerHTML = `
      <div class="card">
        <div class="card-body p-4">
          <h5>${entry.organization}</h5>
          <small><i class="fas fa-calendar-alt me-1"></i>${formatFullDate(entry.date)}</small><br/>
          <hr>
          <strong>${entry.eventName}</strong><br/>
          <small>By <a href="${entry.spokesperson.link}" target="_blank">${entry.spokesperson.name}</a> at <a href="${entry.venue.link}" target="_blank">${entry.venue.name}</a></small><br/>
          <small>${entry.city}, ${entry.region}, ${entry.country}</small><br/>
          <small>${entry.type} | ${entry.location}</small>
        </div>
      </div>
    `;
    return { card, latestEndDate: dateObj };
}

function createCertificateCard(entry, category) {
    const start = parseDate(entry.start);
    const end = entry.end ? parseDate(entry.end) : null;
    const dateRange = entry.end
        ? `${formatMonthYear(entry.start)} – ${formatMonthYear(entry.end)}`
        : formatMonthYear(entry.start);

    const card = document.createElement('div');
    card.className = 'timeline-5 right-5';
    card.dataset.category = category;

    const downloadUrl = entry.file ? `${window.location.origin}/${entry.file}` : null;
    const downloadBtn = entry.file
        ? `<a href="${downloadUrl}" download class="btn btn-sm btn-outline-primary float-end" title="Download certificate">
         <i class="fas fa-download"></i>
       </a>`
        : '';

    card.innerHTML = `
      <div class="card">
        <div class="card-body p-4">
          ${downloadBtn}
          <h5>${entry.name}</h5>
          <hr>
          <p class="mb-1"><strong>${entry.issuer}</strong></p>
          <span class="small text-muted">${dateRange}</span>
        </div>
      </div>
    `;
    return { card, latestEndDate: end || start };
}


function renderFilters(categories) {
    const filterContainer = document.getElementById('categoryFilters');
    filterContainer.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'btn btn-outline-primary m-1';
    allBtn.textContent = 'All';
    allBtn.dataset.category = 'all';
    allBtn.classList.add('active')
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
    const allCards = [];

    data.timeline.forEach(category => {
        const categoryName = category.category;
        categorySet.add(categoryName);

        category.entries.forEach(entry => {
            if (entry.jobs) {
                const locationText = `${entry.city}, ${entry.region}, ${entry.country}`;
                const card = createCompanyCard(entry.organization, locationText, entry.jobs, categoryName);
                const latestEnd = entry.jobs.reduce((latest, current) =>
                    parseDate(current.end || null) > parseDate(latest.end || null) ? current : latest
                );
                allCards.push({ card, latestEndDate: parseDate(latestEnd.end || null) });
            } else if (entry.eventName) {
                const conf = createConferenceCard(entry, categoryName);
                allCards.push(conf);
            } else if (entry.name && entry.issuer) {
                const cert = createCertificateCard(entry, categoryName);
                allCards.push(cert);
            }
        });

    });

    allCards
        .slice()
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
