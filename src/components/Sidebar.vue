<template>
  <aside class="sidebar">

    <div>
      <div class="profile">
        <h1>{{ profile.name }}</h1>
        <p class="title">{{ profile.title }}</p>
      </div>

      <nav class="nav">
        <a href="#work">Work Experience</a>
      </nav>
    </div>

    <div v-if="profile.socials?.length" class="socials">
      <a v-for="social in profile.socials" :key="social.platform" :href="social.url" target="_blank" rel="noopener"
        class="social-btn">
        <i :class="getIconClass(social.platform)" />
      </a>
    </div>

  </aside>
</template>

<script setup lang="ts">
defineProps<{
  profile: {
    name: string
    title: string
    socials?: {
      platform: string
      url: string
    }[]
  }
}>()

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
  overflow: hidden;
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

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav a {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: 0.2s;
}

.nav a:hover {
  color: #2563eb;
}

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
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #2563eb;
  color: white;
}
</style>
