async function loadTimeline() {
    const root = document.getElementById('timeline-root');
    const buttonGroup = document.getElementById('category-buttons');

    try {
        const response = await fetch('/assets/data/career.json');
        const data = await response.json();

        const categories = [];

        data.timeline.forEach(section => {
            const categoryId = section.category.replace(/\s+/g, '-').toLowerCase();
            categories.push({ name: section.category, id: categoryId });

            section.entries.forEach(entry => {
                // Sort jobs by start date
                entry.jobs.sort((a, b) => new Date(parseDate(a.start)) - new Date(parseDate(b.start)));

                const start = entry.jobs[0].start;
                const end = entry.jobs[entry.jobs.length - 1].end || null;
                const duration = calculateDuration(start, end);

                const orgLocation = [entry.city, entry.region, entry.country].filter(Boolean).join(", ");
                let jobsHtml = "";

                entry.jobs.forEach(job => {
                    const formattedEnd = formatDateLabel(job.end);
                    const meta = [`${job.start} - ${formattedEnd}`, job.type, job.location].filter(Boolean).join(" | ");
                    jobsHtml += `
              <div class="mb-2">
                <strong>${job.title}</strong><br>
                <small class="text-muted">${meta}</small>
                <p>${job.description}</p>
              </div>
            `;
                });

                const card = document.createElement('div');
                card.className = `col category-card ${categoryId}`;
                card.innerHTML = `
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${entry.organization}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${orgLocation}</h6>
                <p><strong>Service Time:</strong> ${duration}</p>
                ${jobsHtml}
              </div>
            </div>
          `;

                root.appendChild(card);
            });
        });

        // Create category toggle buttons
        categories.forEach(cat => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary btn-sm me-2';
            button.dataset.category = cat.id;
            button.textContent = cat.name;
            button.onclick = () => {
                document.querySelectorAll(`.category-card`).forEach(el => el.style.display = 'none');
                document.querySelectorAll(`.${cat.id}`).forEach(el => el.style.display = 'block');
            };
            buttonGroup.appendChild(button);
        });

        // Show all by default
        document.querySelectorAll(`.category-card`).forEach(el => el.style.display = 'block');

    } catch (error) {
        root.innerHTML = `<p class="text-danger">Failed to load timeline data.</p>`;
        console.error('Error loading JSON:', error);
    }
}

function parseDate(monthYear) {
    if (!monthYear) return new Date(); // Use current date if empty
    const [month, year] = monthYear.split('-');
    return new Date(`${year}-${month}-01`);
}

function formatDateLabel(monthYear) {
    return monthYear ? monthYear : "Current";
}

function calculateDuration(start, end) {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (remMonths > 0) parts.push(`${remMonths} month${remMonths > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(' ') : 'Less than a month';
}

loadTimeline();