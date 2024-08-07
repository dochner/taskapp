<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'i-mdi-moon-and-stars' : 'i-mdi-weather-sunny')

const isMenuOpened = ref(false)

function toggleMenu() {
  isMenuOpened.value = !isMenuOpened.value
}

async function logout() {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <header class="backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50 lg:!border-transparent bg-gray-50 dark:bg-gray-950">
    <Title>Todo list</Title>
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[--header-height]">
      <div class="lg:flex-1 flex items-center gap-1.5">
        <ULink
          class="flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white flex items-end gap-1.5"
          to="/"
        >
          Todo List

          <UBadge variant="soft">
            v1.0.0
          </UBadge>
        </ULink>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          :icon="colorModeIcon"
          :ui="{ rounded: 'full' }"
          variant="outline"
          @click="toggleDark"
        />

        <UButton
          :aria-label="`Toggle menu visibility, current: ${isMenuOpened}`"
          icon="i-mdi-menu"
          variant="soft"
          @click="toggleMenu"
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

    <USlideover v-model="isMenuOpened">
      <div class="p-4 flex-1">
        <UButton
          class="flex sm:hidden absolute end-5 top-5 z-10"
          icon="i-heroicons-x-mark-20-solid"
          padded
          size="sm"
          square
          variant="soft"
          @click="toggleMenu"
        />

        <Placeholder class="mt-12 flex-1 w-full h-full max-h-[calc(100%-3rem)]" />
      </div>
    </USlideover>
  </header>
</template>
