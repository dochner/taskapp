<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'i-mdi-moon-and-stars' : 'i-mdi-weather-sunny')

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div>
    <Title>Todo list</Title>
    <div class="flex items-center md:justify-between justify-center">
      <div class="hidden md:block">
        <UButton
          label="Source"
          target="_blank"
          to="https://github.com/dochner/todo-list-supabase"
          icon="i-mdi-external-link"
        />
      </div>
      <div class="flex items-center">
        <UButton
          :icon="colorModeIcon"
          @click="toggleDark"
        />
        <UButton
          v-if="user"
          class="u-text-white"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>