<template>
  <div v-if="socials?.length" class="socials">
    <a
      v-for="social in socials"
      :key="social.platform"
      :href="social.url"
      target="_blank"
      rel="noopener"
      class="social-btn"
    >
      <i :class="getIconClass(social.platform)" />
    </a>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  socials?: {
    platform: string
    url: string
  }[]
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