<template>
  <section id="work">
    <h2>Work Experience</h2>

    <div v-for="company in work" :key="company.company" class="company-block">
      <h3 class="company-name">{{ company.company }} • {{ company.location }}</h3>

      <div v-for="job in company.jobs" :key="job.role + job.start" class="job">
        <div class="header">
          <h4>{{ job.role }}</h4>
          <span class="period">{{ formatPeriod(job.start, job.end) }} • {{ calculateDuration(job.start, job.end) }}</span>
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
import { defineProps } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

defineProps<{
  work: Array<{
    company: string
    location: string
    jobs: Array<{
      role: string
      start: string
      end: string
      description: string
      highlights: string[]
    }>
  }>
}>()

/**
 * Format period string
 */
const formatPeriod = (start: string, end: string) => {
  const startDate = dayjs(start)
  const endDate = end ? dayjs(end) : dayjs()
  return `${startDate.format('MMM YYYY')} - ${endDate.format('MMM YYYY')}`
}

/**
 * Calculate duration in years and months
 */
const calculateDuration = (start: string, end: string) => {
  const startDate = dayjs(start)
  const endDate = end ? dayjs(end) : dayjs()
  const totalMonths = endDate.diff(startDate, 'month')
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  let result = ''
  if (years > 0) result += `${years}y `
  if (months > 0) result += `${months}m`
  return result.trim()
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

.company-block {
  margin-bottom: 50px;
}

.company-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
}

.job {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

h4 {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

.period {
  font-size: 14px;
  color: #6b7280;
}

.description {
  margin-bottom: 12px;
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