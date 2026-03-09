<template>
    <div class="profile">

        <div class="avatar">
            <img src="../images/profile.jpg" alt="Profile picture" />
        </div>

        <h1>{{ profile.name }}</h1>
        <p class="title">{{ profile.title }}</p>

        <div v-if="activeJobs.length" class="active-jobs">
            <div v-for="job in activeJobs" :key="job.role + job.company" class="active-job">
                <strong>{{ job.role }}</strong> <span>at {{ job.company }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  profile: {
    name: string
    title: string
  }
  work: {
    company: string
    jobs: {
      role: string
      start: string
      end?: string
    }[]
  }[]
  image: string
}>()

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
</script>

<style scoped>
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

.avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 18px auto;
  border-radius: 50%;
  padding: 3px;

  background: linear-gradient(145deg, #f8fafc, #e5e7eb);

  box-shadow:
    0 8px 18px rgba(0,0,0,0.08),
    0 2px 4px rgba(0,0,0,0.04);

  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  object-fit: cover;
  object-position: center;

  border: 2px solid white;
}
</style>