<template>
  <aside class="sidebar">

    <div>
      <ProfileCard :profile="profile" :work="work" image="/images/profile.jpg" />

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
            v-for="category in categories"
            :key="category"
            class="filter-btn"
            :class="{ active: activeFilters.includes(category) }"
            @click="$emit('toggleFilter', category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

    </div>

    <SidebarSocials :socials="profile.socials" />

  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileCard from './ProfileCard.vue'
import SidebarSocials from './SidebarSocials.vue'

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

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 30px 0;
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
</style>