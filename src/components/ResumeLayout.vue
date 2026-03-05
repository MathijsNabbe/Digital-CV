<template>
  <div class="layout">
    <Sidebar :profile="profile" :work="work" />

    <div class="content">
      <WorkExperience :work="work" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import WorkExperience from './WorkExperience.vue'

// Import JSON statically
import resume from '../data/career.json'

const profile = resume.profile
const work = resume.work
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