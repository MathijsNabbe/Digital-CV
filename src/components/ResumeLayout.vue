<template>
  <div class="layout">
    <Sidebar
      :profile="profile"
      :work="work"
      :categories="categories"
      :activeFilters="activeFilters"
      @toggleFilter="toggleFilter"
    />

    <div class="content">
      <WorkExperience
        :work="work"
        :activeFilters="activeFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from './Sidebar.vue'
import WorkExperience from './WorkExperience.vue'

import resume from '../data/career.json'

const profile = resume.profile
const work = resume.work

const activeFilters = ref<string[]>([])

/**
 * Collect all categories across the resume
 * (future proof for education, conferences etc)
 */
const categories = computed(() => {
  const set = new Set<string>()

  work.forEach(company => {
    company.jobs.forEach(job => {
      job.categories?.forEach((c: string) => set.add(c))
    })
  })

  return Array.from(set).sort()
})

function toggleFilter(category: string) {
  const index = activeFilters.value.indexOf(category)

  if (index === -1)
    activeFilters.value.push(category)
  else
    activeFilters.value.splice(index, 1)
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f5f7fa;
}

.content {
  flex: 1;
  padding: 60px;
  overflow-y: auto;
  height: 100vh;
}
</style>