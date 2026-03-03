<template>
  <section id="work">
    <h2>Work Experience</h2>

    <div v-for="company in work" :key="company.company" class="company-group">
      <p class="company-name">{{ company.company }} • {{ company.location }}</p>
      <p class="company-period">
        {{ formatCompanyPeriod(company.jobs) }}
        <span v-if="company.jobs.length > 0"> • {{ companyDuration(company.jobs) }}</span>
      </p>

      <div v-for="job in company.jobs" :key="job.role + job.start" class="job">
        <div class="header">
          <h3>{{ job.role }}</h3>
          <span class="period">{{ formatPeriod(job.start, job.end) }} • {{ jobDuration(job.start, job.end) }}</span>
        </div>

        <p class="description">{{ job.description }}</p>

        <ul>
          <li v-for="item in job.highlights" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import minMax from 'dayjs/plugin/minMax'

dayjs.extend(duration)
dayjs.extend(minMax)

interface Job {
  role: string
  start: string
  end?: string
  description?: string
  highlights: string[]
}

interface Company {
  company: string
  location: string
  jobs: Job[]
}

const props = defineProps<{
  work: Company[]
}>()

/**
 * Format the start and end dates as "MMM YYYY – MMM YYYY" or "MMM YYYY – Present"
 */
function formatPeriod(start: string, end?: string) {
  const startDate = dayjs(start)
  const endDate = end ? dayjs(end) : dayjs()
  return `${startDate.format('MMM YYYY')} – ${end ? endDate.format('MMM YYYY') : 'Present'}`
}

/**
 * Calculate the duration between start and end in years + months
 */
function jobDuration(start: string, end?: string) {
  const startDate = dayjs(start)
  const endDate = end ? dayjs(end) : dayjs()
  const months = endDate.diff(startDate, 'month')
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const parts = []
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (remMonths > 0) parts.push(`${remMonths} month${remMonths > 1 ? 's' : ''}`)
  return parts.join(' ')
}

/**
 * Calculate total duration of all jobs in a company
 * from earliest start to latest end
 */
function companyDuration(jobs: Job[]) {
  if (!jobs || jobs.length === 0) return ''

  const startDates = jobs.map(j => dayjs(j.start))
  const endDates = jobs.map(j => j.end ? dayjs(j.end) : dayjs())

  const earliest = dayjs.min(...startDates)
  const latest = dayjs.max(...endDates)

  if (!earliest || !latest) return ''

  const months = latest.diff(earliest, 'month')
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const parts = []
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (remMonths > 0) parts.push(`${remMonths} month${remMonths > 1 ? 's' : ''}`)
  return parts.join(' ')
}

/**
 * Format company period as "MMM YYYY – MMM YYYY"
 */
function formatCompanyPeriod(jobs: Job[]) {
  if (!jobs || jobs.length === 0) return ''
  const startDates = jobs.map(j => dayjs(j.start))
  const endDates = jobs.map(j => j.end ? dayjs(j.end) : dayjs())
  const earliest = dayjs.min(...startDates)
  const latest = dayjs.max(...endDates)
  if (!earliest || !latest) return ''
  return `${earliest.format('MMM YYYY')} – ${latest.format('MMM YYYY')}`
}
</script>

<style scoped>
section {
  max-width: 900px;
}

h2 {
  font-size: 28px;
  margin-bottom: 40px;
  font-weight: 600;
  color: #111827;
}

.company-group {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.company-name {
  font-weight: 600;
  font-size: 20px;
  color: #374151;
  margin-top: 20px;
  margin-bottom: 2px;
}

.company-period {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 20px 0;
}

.job {
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.period {
  font-size: 14px;
  color: #6b7280;
}

.description {
  margin: 12px 0;
  color: #4b5563;
}

ul {
  padding-left: 20px;
  margin: 0;
}

li {
  margin-bottom: 6px;
  color: #4b5563;
}
</style>