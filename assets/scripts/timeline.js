async function loadTimeline() {
    const root = document.getElementById('timeline-root');
    const buttonGroup = document.getElementById('category-buttons');

    try {
        const response = await fetch('/assets/data/career.json');
        const data = await response.json();

        const categories = [];

        // Extract and collect categories
        data.timeline.forEach(section => {
            const categoryId = section.category.replace(/\s+/g, '-').toLowerCase();
            categories.push({ name: section.category, id: categoryId });
        });

        // Buttons tracking
        const buttons = [];

        function setActiveButton(activeBtn) {
            buttons.forEach(btn => btn.classList.remove('btn-primary'));
            buttons.forEach(btn => btn.classList.add('btn-outline-primary'));
            activeBtn.classList.remove('btn-outline-primary');
            activeBtn.classList.add('btn-primary');
        }

        // Renders timeline (all or filtered)
        function renderTimeline(selectedCategory = null) {
            root.innerHTML = '';

            let allEntries = [];

            data.timeline.forEach(section => {
                const categoryId = section.category.replace(/\s+/g, '-').toLowerCase();

                section.entries.forEach(entry => {
                    allEntries.push({
                        ...entry,
                        categoryId,
                        categoryName: section.category
                    });
                });
            });

            // Filter if needed
            if (selectedCategory) {
                allEntries = allEntries.filter(e => e.categoryId === selectedCategory);
            }

            // Sort entries by latest job date (end or start fallback)
            allEntries.sort((a, b) => {
                const latestDate = (entry) =>
                    entry.jobs
                        .map(j => parseDate(j.end || j.start))
                        .sort((a, b) => b - a)[0];
                return latestDate(b) - latestDate(a);
            });

            // Render each card
            allEntries.forEach(entry => {
                // Sort jobs within entry by start descending
                entry.jobs.sort((a, b) => parseDate(b.start) - parseDate(a.start));

                const start = entry.jobs[entry.jobs.length - 1].start;
                const end = entry.jobs[0].end || null;
                const duration = calculateDuration(start, end);
                const orgLocation = [entry.city, entry.region, entry.country].filter(Boolean).join(", ");

                let jobsHtml = "";
                entry.jobs.forEach(job => {
                    const formattedEnd = formatDateLabel(job.end);
                    const meta = [`${job.start} - ${formattedEnd}`, job.type, job.location].filter(Boolean).join(" | ");
                    const jobDuration = calculateDuration(job.start, job.end);

                    jobsHtml += `
                        <div class="mb-2">
                            <strong>${job.title}</strong><br>
                            <small class="text-muted">${meta}</small><br>
                            <small class="text-muted">Duration: ${jobDuration}</small>
                            <p class="mt-1">${job.description}</p>
                        </div>
                    `;
                });

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
            });
        }

        // Create "All" button
        const allButton = document.createElement('button');
        allButton.className = 'btn btn-primary btn-sm me-2'; // Active by default
        allButton.textContent = 'All';
        allButton.onclick = () => {
            renderTimeline(); // All entries
            setActiveButton(allButton);
        };
        buttonGroup.appendChild(allButton);
        buttons.push(allButton);

        // Create category buttons
        categories.forEach(cat => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary btn-sm me-2';
            button.dataset.category = cat.id;
            button.textContent = cat.name;
            button.onclick = () => {
                renderTimeline(cat.id);
                setActiveButton(button);
            };
            buttonGroup.appendChild(button);
            buttons.push(button);
        });

        // Render "All" on page load
        renderTimeline();
        setActiveButton(allButton);

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
    if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
    if (remMonths > 0) parts.push(`${remMonths} month${remMonths === 1 ? '' : 's'}`);

    return parts.length > 0 ? parts.join(' ') : 'Less than a month';
}

loadTimeline();
