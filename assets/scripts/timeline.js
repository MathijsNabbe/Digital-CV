async function loadTimeline() {
    const root = document.getElementById('timeline-root');
    const buttonGroup = document.getElementById('category-buttons');

    try {
        const data = await fetchTimelineData('/assets/data/career.json');
        const categories = extractCategories(data);

        const buttons = createCategoryButtons(categories, buttonGroup, data, root);

        // Render timeline and default active button
        renderTimeline(data, root);
        setActiveButton(buttons[0]);

    } catch (error) {
        root.innerHTML = `<p class="text-danger">Failed to load timeline data.</p>`;
        console.error('Error loading JSON:', error);
    }
}

async function fetchTimelineData(url) {
    const response = await fetch(url);
    return await response.json();
}

function extractCategories(data) {
    return data.timeline.map(section => ({
        name: section.category,
        id: section.category.replace(/\s+/g, '-').toLowerCase()
    }));
}

function createCategoryButtons(categories, buttonGroup, data, root) {
    const buttons = [];

    // Create "All" button
    const allButton = createButton('All', 'btn-primary', buttonGroup, () => {
        renderTimeline(data, root); // All entries
        setActiveButton(allButton);
    });
    buttons.push(allButton);

    // Create category buttons
    categories.forEach(cat => {
        const button = createButton(cat.name, 'btn-outline-primary', buttonGroup, () => {
            renderTimeline(data, root, cat.id);
            setActiveButton(button);
        });
        buttons.push(button);
    });

    return buttons;
}

function createButton(name, className, parent, onClick) {
    const button = document.createElement('button');
    button.className = `btn ${className} btn-sm me-2`;
    button.textContent = name;
    button.onclick = onClick;
    parent.appendChild(button);
    return button;
}

function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.remove('btn-primary', 'btn-outline-primary');
        btn.classList.add('btn-outline-primary');
    });
    activeBtn.classList.remove('btn-outline-primary');
    activeBtn.classList.add('btn-primary');
}

function renderTimeline(data, root, selectedCategory = null) {
    root.innerHTML = '';
    let allEntries = extractEntries(data);

    if (selectedCategory) {
        allEntries = allEntries.filter(e => e.categoryId === selectedCategory);
    }

    // Sort entries by latest job date (end or start fallback)
    allEntries.sort((a, b) => compareDates(latestDate(b), latestDate(a)));

    allEntries.forEach(entry => renderCard(entry, root));
}

function extractEntries(data) {
    return data.timeline.flatMap(section => {
        const categoryId = section.category.replace(/\s+/g, '-').toLowerCase();
        return section.entries.map(entry => ({
            ...entry,
            categoryId,
            categoryName: section.category
        }));
    });
}

function latestDate(entry) {
    return entry.jobs
        .map(j => parseDate(j.end || j.start))
        .sort((a, b) => b - a)[0];
}

function compareDates(a, b) {
    return a - b;
}

function renderCard(entry, root) {
    entry.jobs.sort((a, b) => parseDate(b.start) - parseDate(a.start));

    const { duration, orgLocation, jobsHtml } = calculateCardDetails(entry);

    const card = document.createElement('div');
    card.className = `col category-card ${entry.categoryId} mb-4`;
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
}

function calculateCardDetails(entry) {
    const start = entry.jobs[entry.jobs.length - 1].start;
    const end = entry.jobs[0].end || null;
    const duration = calculateDuration(start, end);
    const orgLocation = [entry.city, entry.region, entry.country].filter(Boolean).join(", ");

    let jobsHtml = entry.jobs.map(job => {
        const formattedEnd = formatDateLabel(job.end);
        const meta = [`${job.start} - ${formattedEnd}`, job.type, job.location].filter(Boolean).join(" | ");
        const jobDuration = calculateDuration(job.start, job.end);

        return `
            <div class="mb-2">
                <strong>${job.title}</strong><br>
                <small class="text-muted">${meta}</small><br>
                <small class="text-muted">Duration: ${jobDuration}</small>
                <p class="mt-1">${job.description}</p>
            </div>
        `;
    }).join("");

    return { start, end, duration, orgLocation, jobsHtml };
}

function calculateDuration(start, end) {
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
    if (remMonths > 0) parts.push(`${remMonths} month${remMonths === 1 ? '' : 's'}`);

    return parts.length > 0 ? parts.join(' ') : 'Less than a month';
}

function parseDate(monthYear) {
    if (!monthYear) return new Date();
    const [month, year] = monthYear.split('-');
    return new Date(`${year}-${month}-01`);
}

function formatDateLabel(monthYear) {
    return monthYear || "Current";
}

loadTimeline();
