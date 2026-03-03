<template>
  <section id="work">
    <h2>Work Experience</h2>
    <div v-for="job in work" :key="job.company" class="job">
      <div class="header">
        <h3>{{ job.role }}</h3> <span class="period">{{ job.period }}</span>
      </div>
      <p class="company"> {{ job.company }} • {{ job.location }} </p>
      <p class="description"> {{ job.description }} </p>
      <ul>
        <li v-for="item in job.highlights" :key="item"> {{ item }} </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ work: any[] }>() 
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

.job {
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.period {
  font-size: 14px;
  color: #6b7280;
}

.company {
  margin: 6px 0 12px;
  font-weight: 500;
  color: #374151;
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
