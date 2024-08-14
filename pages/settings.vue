<script setup lang="ts">
import type { Database } from '~~/types/database.types'

const profile = ref<Database['public']['Tables']['profiles']['Row'] | null>(null)

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const colorMode = useColorMode()

// Fetch task lists on mount (consider using useAsyncData for better loading state handling)
onMounted(async () => {
  if (user.value) {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      // Handle error
    }
    else {
      profile.value = data
    }
  }
})
</script>

<template>
  <div class="divide-y gap-4 flex flex-col">
    settings

    <div>
      profile: {{ profile }}
    </div>

    <div>
      theme: {{ colorMode }}
    </div>

    <div>
      <button
        class="mt-4"
        @click="client.auth.signOut()"
      >
        Sign out
      </button>
    </div>
  </div>
</template>
