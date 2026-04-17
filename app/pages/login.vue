<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!form.email || !form.password) {
    error.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  if (form.email === 'admin@mobyread.ai' && form.password === 'admin1234') {
    localStorage.setItem('auth_token', 'mock-token-' + Date.now())
    router.push('/')
  } else {
    error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
  }
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-md">
      <!-- Logo & title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 mb-4">
          <UIcon name="i-lucide-book-open" class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">YBM AI Report</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">관리자 계정으로 로그인하세요</p>
      </div>

      <!-- Card -->
      <UCard class="shadow-lg">
        <div class="space-y-5">
          <UFormField label="이메일" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="admin@mobyread.ai"
              icon="i-lucide-mail"
              class="w-full"
              @keyup.enter="handleLogin"
            />
          </UFormField>

          <UFormField label="비밀번호" name="password">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              class="w-full"
              @keyup.enter="handleLogin"
            />
          </UFormField>

          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
            :description="error"
          />

          <UButton
            block
            :loading="loading"
            @click="handleLogin"
          >
            로그인
          </UButton>
        </div>
      </UCard>

      <!-- Mock credentials hint -->
      <UCard class="mt-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
        <div class="flex gap-3">
          <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div class="text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
            <p class="font-semibold">테스트 계정</p>
            <p>이메일: <code class="font-mono">admin@mobyread.ai</code></p>
            <p>비밀번호: <code class="font-mono">admin1234</code></p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
