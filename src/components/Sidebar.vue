<template>
  <aside class="sidebar">

    <div>
      <div class="profile">
        <h1>{{ profile.name }}</h1>
        <p class="title">{{ profile.title }}</p>

        <div v-if="activeJobs.length" class="active-jobs">
          <div v-for="job in activeJobs" :key="job.role + job.company" class="active-job">
            <strong>{{ job.role }}</strong> <span>at {{ job.company }}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <nav class="nav">
        <a href="#work">Work Experience</a>
      </nav>

      <div class="divider"></div>

      <div class="filters">
        <button class="filter-toggle" @click="showFilters = !showFilters">
          <span>Filters</span>
          <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>

        <div v-if="showFilters" class="filter-list">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: activeFilters.includes(cat) }"
            @click="$emit('toggleFilter', cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

    </div>

    <div v-if="profile.socials?.length" class="socials">
      <a
        v-for="social in profile.socials"
        :key="social.platform"
        :href="social.url"
        target="_blank"
        rel="noopener"
        class="social-btn"
      >
        <i :class="getIconClass(social.platform)" />
      </a>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const showFilters = ref(false)

const props = defineProps<{
  profile: {
    name: string
    title: string
    socials?: {
      platform: string
      url: string
    }[]
  }
  work: {
    company: string
    jobs: {
      role: string
      start: string
      end?: string
    }[]
  }[]
  categories: string[]
  activeFilters: string[]
}>()

defineEmits(['toggleFilter'])

const activeJobs = computed(() => {
  return props.work.flatMap(company =>
    company.jobs
      .filter(job => !job.end)
      .map(job => ({
        role: job.role,
        company: company.company
      }))
  )
})

function getIconClass(platform: string) {
  const map: Record<string, string> = {
    github: 'fab fa-github',
    linkedin: 'fab fa-linkedin-in',
    instagram: 'fab fa-instagram'
  }

  return map[platform.toLowerCase()] ?? 'fas fa-link'
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  padding: 40px 20px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.profile {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 22px;
  margin: 0;
  font-weight: 600;
}

.title {
  color: #6b7280;
  margin-top: 8px;
  font-size: 14px;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 30px 0;
}

.active-jobs {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.active-job {
  font-size: 13px;
  color: #374151;
  text-align: center;
}

.active-job span {
  color: #6b7280;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav a {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
}

.nav a:hover {
  color: #2563eb;
}

/* ------------------- Filters ------------------- */
.filters {
  margin-top: 20px;
}

.filter-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: none;
  background: #f9fafb;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle i {
  margin-left: 6px;
  font-size: 12px;
}

.filter-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
}

.filter-btn:hover {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.filter-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
/* ------------------- Socials ------------------- */
.socials {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.social-btn {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 16px;
  text-decoration: none;
}

.social-btn:hover {
  background: #2563eb;
  color: white;
}
</style>