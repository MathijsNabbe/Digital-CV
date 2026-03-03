<template>
  <aside class="sidebar">
    <div class="profile">
      <h1>{{ profile.name }}</h1>
      <p class="title">{{ profile.title }}</p>
    </div>

    <nav class="nav">
      <a href="#work">Work Experience</a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  profile: {
    name: string
    title: string
  }
}>()
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
  justify-content: start;
  overflow: hidden;
}

.profile {
  text-align: center;
  margin-bottom: 60px;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 4px solid #f1f5f9;
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
</style>