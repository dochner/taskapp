<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import type { Task } from '~/types/tasks'
import type { Database } from '~~/types/database.types'

const props = defineProps<{
  list: Database['public']['Tables']['task_lists']['Row'] // Task list data
}>()

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const tasks = ref<Task[]>([]) // Tasks within the list
const newTaskName = ref('')
const isAddingTask = ref(false)

// Fetch tasks for this list when it's mounted
onMounted(async () => {
  await fetchTasks()
})

// Function to fetch tasks from Supabase
async function fetchTasks() {
  const { data, error } = await client
    .from('tasks')
    .select('id, name, is_completed, created_at')
    .eq('list_id', props.list.id)
    .order('created_at')

  if (error) {
    console.error('Error fetching tasks:', error)
    // Handle error (show a notification, etc.)
  }
  else {
    tasks.value = data as Task[]
  }
}

// Function to add a new task
async function addTask() {
  if (!newTaskName.value.trim())
    return // Don't add empty tasks

  isAddingTask.value = true

  const newTask: Task = {
    id: uuidv4(), // Generate a unique ID
    name: newTaskName.value.trim(),
    description: '',
    is_completed: false,
    list_id: props.list.id,
    created_at: new Date().toISOString(),
  }

  const { error } = await client.from('tasks').insert(newTask)

  if (error) {
    console.error('Error adding task:', error)
    // Handle error
  }
  else {
    tasks.value.push(newTask) // Add to local list
    newTaskName.value = '' // Clear input
  }

  isAddingTask.value = false
}

// Function to toggle task completion
async function toggleTaskCompletion(task: Task) {
  const { error } = await client
    .from('tasks')
    .update({ is_completed: !task.is_completed })
    .eq('id', task.id)

  if (error) {
    console.error('Error toggling task completion:', error)
    // Handle error
  }
  else {
    task.is_completed = !task.is_completed // Update local state
  }
}

// Function to delete a task
async function deleteTask(task: Task) {
  const { error } = await client.from('tasks').delete().eq('id', task.id)

  if (error) {
    console.error('Error deleting task:', error)
    // Handle error
  }
  else {
    tasks.value = tasks.value.filter(t => t.id !== task.id) // Remove from local list
  }
}
</script>

<template>
  <UCard
    class="mb-4"
    :title="list.name"
  >
    <form @submit.prevent="addTask">
      <UInput
        v-model="newTaskName"
        class="mb-2"
        :loading="isAddingTask"
        placeholder="Add a new task"
        size="sm"
        :ui="{ icon: isAddingTask ? 'i-mdi-loading' : 'i-mdi-plus' }"
      />
    </form>

    <ul v-if="tasks.length > 0">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center justify-between mb-2"
      >
        <div :class="{ 'line-through text-gray-500': task.is_completed }">
          {{ task.name }}
        </div>
        <div>
          <UCheckbox
            :model-value="task.is_completed ?? false"
            @change="toggleTaskCompletion(task)"
          />
          <UButton
            color="gray"
            icon="i-heroicons-trash"
            size="xs"
            square
            variant="link"
            @click="deleteTask(task)"
          />
        </div>
      </li>
    </ul>
    <div
      v-else
      class="text-center text-gray-500"
    >
      No tasks yet.
    </div>
  </UCard>
</template>
