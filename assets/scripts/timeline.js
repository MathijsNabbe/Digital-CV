async function loadTimeline() {
    const root = document.getElementById('timeline-root');
    try {
      const response = await fetch('../data/career.json');
      const data = await response.json();

      data.timeline.forEach(section => {
        const sectionDiv = document.createElement('div');
        let sectionHtml = "";

        section.entries.forEach(entry => {
          const orgLocation = [entry.city, entry.region, entry.country]
            .filter(Boolean)
            .join(", ");

          let jobsHtml = "";
          entry.jobs.forEach(job => {
            const period = job.start === job.end
              ? job.start
              : `${job.start} - ${job.end}`;
            const meta = [period, job.type, job.location].filter(Boolean).join(" | ");

            jobsHtml += `
              <div class="timeline-event ms-3">
                <h6>${job.title}</h6>
                <small class="text-muted">${meta}</small>
                <p>${job.description}</p>
              </div>
            `;
          });

          sectionHtml += `
            <div class="company-block mb-4">
              <h5>${entry.organization}</h5>
              <small class="text-muted">${orgLocation}</small>
              ${jobsHtml}
            </div>
          `;
        });

        sectionDiv.innerHTML = `
          <div class="category-header mt-4">${section.category}</div>
          <div class="timeline">${sectionHtml}</div>
        `;

        root.appendChild(sectionDiv);
      });
    } catch (error) {
      root.innerHTML = `<p class="text-danger">Failed to load timeline data.</p>`;
      console.error('Error loading JSON:', error);
    }
  }

  loadTimeline();