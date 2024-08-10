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
      .or(`owner_id.eq.${user.value.id},id.in.(select list_id from task_list_shares where user_id.eq.${user.value.id})`)

    if (error) {
      console.error('Error fetching task lists:', error)
      // Handle error
    }
    else {
      taskLists.value = data as Database['public']['Tables']['task_lists']['Row'][]
    }
  }
})

const tasksFromServer = ref()
const isModalOpen = ref(false)
const loading = ref(false)
const newTask = ref('')

const { data: tasks } = await useAsyncData('tasks', async () => {
  const { data } = await client.from('tasks').select('id, name, is_completed').order('created_at')

  return data
})

async function addTask() {
  console.warn('add task!')
}

async function completeTask(task: Partial<Task>) {
  await client.from('tasks').update({ is_completed: task.is_completed }).match({ id: task.id })
}

async function removeTask(task: Partial<Task>) {
  if (tasks.value?.length === 1)
    tasks.value = tasks.value.filter(t => t.id !== task.id)

  await client.from('tasks').delete().match({ id: task.id })
}

async function fetchtasksFromServerRoute() {
  const { data } = await useFetch('/api/tasks', { headers: useRequestHeaders(['cookie']), key: 'tasks-from-server' })

  tasksFromServer.value = data
  isModalOpen.value = true
}
</script>

<template>
  <div>
    <div class="w-full my-[50px]">
      <h1 class="mb-12 text-6xl font-bold u-text-white">
        Task Lists
      </h1>
    </div>

    <div v-if="taskLists.length > 0">
      <TaskList
        v-for="list in taskLists"
        :key="list.id"
        :list="list"
      />
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
