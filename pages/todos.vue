<script setup lang="ts">
import type { Database } from '~~/types/database.types'

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const todosFromServer = ref()
const isModalOpen = ref(false)
const loading = ref(false)
const newTodo = ref('')

const { data: todos } = await useAsyncData('todos', async () => {
  const { data } = await client.from('todos').select('id, task, is_complete').eq('user_id', user.value.id).order('inserted_at')

  return data
})

async function addTodo() {
  if (newTodo.value.trim().length === 0) return

  loading.value = true

  const { data } = await client.from('todos')
    .upsert({
      user_id: user.value.id,
      task: newTodo.value,
      is_complete: false,
    })
    .select('id, task, is_complete')
    .single()

  // Fix this any later please
  todos.value?.push(data as any)
  newTodo.value = ''
  loading.value = false
}

const completeTodo = async (todo: Partial<Todo>) => {
  await client.from('todos').update({ is_complete: todo.is_complete }).match({ id: todo.id })
}

const removeTodo = async (todo: Partial<Todo>) => {
  if (todos.value?.length === 1)
    todos.value = todos.value.filter(t => t.id !== todo.id)

  await client.from('todos').delete().match({ id: todo.id })
}

const fetchtodosFromServerRoute = async () => {
  const { data } = await useFetch('/api/todos', { headers: useRequestHeaders(['cookie']), key: 'todos-from-server' })

  todosFromServer.value = data
  isModalOpen.value = true
}
</script>

<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
      Todo List.
    </h1>
    <form
      class="flex gap-2 my-2"
      @submit.prevent="addTodo"
    >
      <UInput
        v-model="newTodo"
        :loading="loading"
        class="w-full"
        size="xl"
        color="white"
        type="text"
        name="newTodo"
        placeholder="Make a coffee"
        autofocus
        autocomplete="off"
      />
      <UButton
        type="submit"
        color="white"
      >
        Add
      </UButton>
    </form>
    <UCard
      v-if="todos?.length && todos?.length > 0"
      body-class="px-6 py-2 overflow-hidden"
    >
      <ul>
        <li
          v-for="todo of todos"
          :key="todo.id"
          class="border-b border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <UFormGroup
              :label-class="`block font-medium ${todo.is_complete ? 'line-through u-text-gray-500' : 'u-text-gray-700'}`"
              :label="todo.task ?? undefined"
              :name="String(todo.id)"
              wrapper-class="flex items-center justify-between w-full"
            >
              <div class="flex items-center justify-between">
                <div @click="completeTodo(todo)">
                  <UToggle
                    :model-value="todo.is_complete ?? undefined"
                    :name="String(todo.id)"
                    icon-off="heroicons-solid:x"
                    icon-on="heroicons-solid:check"
                    @update:model-value="(event) => todo.is_complete = event"
                  />
                </div>
                <UButton
                  class="ml-3 text-red-600"
                  size="sm"
                  icon="i-heroicons-outline-trash"
                  @click="removeTodo(todo)"
                />
              </div>
            </UFormGroup>
          </div>
        </li>
      </ul>
    </UCard>
    <UButton
      class="mt-6"
      label="Fetch todos from Nuxt server route"
      @click="fetchtodosFromServerRoute"
    />
    <UModal v-model="isModalOpen">
      <h2 class="mb-4">
        todos fetched from
        <a
          href="https://nuxt.com/docs/guide/directory-structure/server"
          target="_blank"
          class="text-primary-500 underline"
        >Nuxt Server route</a>
        with the use of the
        <a
          href="https://supabase.nuxtjs.org/usage/services/server-supabase-client"
          target="_blank"
          class="text-primary-500 underline"
        >serverSupabaseClient</a>:
      </h2>
      <pre>
        {{ todosFromServer }}
      </pre>
    </UModal>
  </div>
</template>

<style lang="postcss">
ul > li:last-child {
  @apply border-b-0;
}
</style>