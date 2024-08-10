<script setup lang="ts">
import { type InferType, object, string } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
})

type Schema = InferType<typeof schema>

definePageMeta({
  layout: 'clear',
})

const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`

const state = reactive({
  email: undefined,
  password: undefined,
})

async function signInWithGoogle() {
  // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
  const { error } = await auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  // eslint-disable-next-line no-console
  console.log(event.data)
}

const loading = ref(true)

onBeforeMount(() => {
  if (user.value) {
    navigateTo('/todos')
  }
  else {
    loading.value = false
  }
})
</script>

<template>
  <div class="h-screen flex items-center justify-center overlay w-full">
    <div class="gradient" />

    <div
      v-if="!loading"
      class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
    >
      <div class="px-4 py-5 sm:p-6">
        <div class="w-full max-w-sm space-y-6">
          <div class="text-center">
            <div class="mb-2 pointer-events-none">
              <UIcon
                class="flex-shrink-0 text-gray-900 dark:text-white "
                name="i-mdi-lock-outline"
                size="2rem"
              />
            </div>

            <p class="text-2xl text-gray-900 dark:text-white font-bold">
              Welcome
            </p>

            <div class="text-gray-500 dark:text-gray-400 mt-1">
              Don't have an account? <ULink
                class="text-primary"
              >
                Sign up
              </ULink>.
            </div>
          </div>
          <div class="gap-y-6 flex flex-col flex-col-reverse">
            <div class="space-y-3">
              <UButton
                class="w-full justify-center"
                icon="i-mdi-google"
                :ui="{ rounded: 'rounded-full' }"
                variant="soft"
                @click="signInWithGoogle"
              >
                Sign in with Google
              </UButton>
            </div>

            <div class="flex items-center align-center text-center w-full flex-row">
              <UDivider>or</UDivider>
            </div>

            <UForm
              :schema="schema"
              :state="state"
              @submit="onSubmit"
            >
              <UFormGroup>
                <ULabel class="text-xs font-medium">
                  Email
                </ULabel>

                <UInput
                  v-model="state.email"
                  placeholder="Enter your e-mail"
                  type="email"
                />
              </UFormGroup>

              <UButton
                class="w-full justify-center mt-8"
                trailing-icon="i-mdi-arrow-right"
                type="submit"
                :ui="{ rounded: 'rounded-full' }"
              >
                Continue
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="u-text-black">
        Loading...
      </p>
    </div>
  </div>
</template>
