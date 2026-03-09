<template>
  <section id="education">
    <h2>Education & Certificates</h2>

    <div
      v-for="item in filteredEducation"
      :key="item.title + (item.start || item.date || '')"
      class="education-item"
    >
      <div class="header">
        <div>
          <h3>{{ item.title }}</h3>
          <p v-if="item.institution" class="institution">{{ item.institution }}</p>
        </div>
        <span class="period">
          {{ formatEducationPeriod(item) }}
        </span>
      </div>

      <!-- certificate download link intentionally omitted -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

interface EducationItem {
  title: string
  institution?: string
  start?: string
  end?: string
  date?: string
  categories?: string[]
  link?: string
}

const props = defineProps<{
  education: EducationItem[]
  activeFilters: string[]
}>()

const filteredEducation = computed(() => {
  if (!props.education) return []

  const base = [...props.education].sort((a, b) => {
    const aDate = dayjs(a.start || a.date)
    const bDate = dayjs(b.start || b.date)
    if (!aDate.isValid() && !bDate.isValid()) return 0
    if (!aDate.isValid()) return 1
    if (!bDate.isValid()) return -1
    // Newest first
    return bDate.valueOf() - aDate.valueOf()
  })

  if (props.activeFilters.length === 0)
    return base

  return base.filter(item =>
    item.categories?.some(cat => props.activeFilters.includes(cat))
  )
})

function formatEducationPeriod(item: EducationItem) {
  if (item.start) {
    const start = dayjs(item.start).format('MMM YYYY')
    if (item.end) {
      const end = dayjs(item.end).format('MMM YYYY')
      return `${start} – ${end}`
    }
    return `${start} – Present`
  }

  if (item.date) {
    return dayjs(item.date).format('MMM YYYY')
  }

  return ''
}
</script>

<style scoped>
section {
  max-width: 900px;
  margin-top: 40px;
}

h2 {
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: 600;
  color: #111827;
}

.education-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
  margin-bottom: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.institution {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.period {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

</style>

