<script setup lang="ts">
import type { Task } from '~/types/tasks'
import type { Database } from '~~/types/database.types'

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const taskLists = ref<
  Database['public']['Tables']['task_lists']['Row'][]
>([])

// Fetch task lists on mount (consider using useAsyncData for better loading state handling)
onMounted(async () => {
  if (user.value) {
    const { data, error } = await client
      .from('task_lists')
      .select('*')

    if (error) {
      console.error('Error fetching task lists:', error)
      // Handle error
    }
    else {
      taskLists.value = data as Database['public']['Tables']['task_lists']['Row'][]
    }
  }
})
</script>

<template>
  <div>
    <div v-if="taskLists?.length && taskLists?.length > 0">
      <li
        v-for="list in taskLists"
        :key="list.id"
      >
        {{ list.name }}
      </li>
    </div>

    <div
      v-else
      class="text-center text-gray-500"
    >
      No task lists yet. Create one to get started!
    </div>
  </div>
</template>

<style lang="postcss">
ul > li:last-child {
  @apply border-b-0;
}
</style>
