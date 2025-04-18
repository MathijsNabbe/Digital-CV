function formatMonthYear(dateStr) {
    const [month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  
  function parseDate(dateStr) {
    const [month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-01`);
  }
  
  function getJobRange(jobs) {
    const starts = jobs.map(j => parseDate(j.start));
    const ends = jobs.map(j => parseDate(j.end));
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return {
      start: minStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
      end: maxEnd.toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }
  
  function createCompanyCard(org, locationText, jobs, category) {
    jobs.sort((a, b) => parseDate(a.start) - parseDate(b.start));
    const dateRange = getJobRange(jobs);
  
    const jobDetails = jobs.map(job => `
      <div class="mb-2">
        <strong>${job.title}</strong>
        <small class="text-muted">(${formatMonthYear(job.start)} – ${formatMonthYear(job.end)})</small><br/>
        <small>${job.type} | ${job.location}</small><br/>
        <p class="mb-0">${job.description || 'No description provided.'}</p>
      </div>
    `).join('');
  
    const card = document.createElement('div');
    card.className = 'timeline-5 right-5';
    card.dataset.category = category; // <- used for filtering
    card.innerHTML = `
      <div class="card">
        <div class="card-body p-4">
          <h5>${org}</h5>
          <span class="small text-muted">
            <i class="fas fa-clock me-1"></i>
            ${dateRange.start} – ${dateRange.end}
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
  
    data.timeline.forEach(category => {
      const categoryName = category.category;
      categorySet.add(categoryName);
  
      category.entries.forEach(entry => {
        const locationText = `${entry.city}, ${entry.region}, ${entry.country}`;
        const card = createCompanyCard(entry.organization, locationText, entry.jobs, categoryName);
        container.appendChild(card);
      });
    });
  
    renderFilters([...categorySet]);
  }
  
  // 🔽 Fetch data from external JSON file
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/assets/data/career.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => renderTimeline(data))
      .catch(error => console.error('Failed to load timeline data:', error));
  });
  