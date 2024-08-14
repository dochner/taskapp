<script setup lang="ts">
const tabItems = [
  {
    label: 'Task lists',
    to: '/',
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'i-mdi-cog',
  },
]
</script>

<template>
  <AppContainer>
    <AppHeader />

    <div class="w-full">
      <UHorizontalNavigation :links="tabItems" />
    </div>

    <PageContainer>
      <NuxtPage />
    </PageContainer>
  </AppContainer>
</template>
