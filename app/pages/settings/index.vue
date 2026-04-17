<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const generalForm = reactive({
  siteName: 'AI Moby Read Report',
  siteUrl: 'https://mobyread.ai',
  supportEmail: 'support@mobyread.ai',
  timezone: 'UTC+9 (서울)'
})

const notificationForm = reactive({
  emailOnComplete: true,
  emailOnReview: true,
  emailDigest: false,
  slackIntegration: false
})

const saved = ref(false)

function saveSettings() {
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}

const timezones = [
  'UTC-8 (로스앤젤레스)',
  'UTC-5 (뉴욕)',
  'UTC+0 (런던)',
  'UTC+1 (파리)',
  'UTC+8 (베이징)',
  'UTC+9 (서울)',
  'UTC+9 (도쿄)'
]
</script>

<template>
  <div class="p-6 space-y-6 max-w-3xl">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">설정</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">애플리케이션 설정을 관리합니다.</p>
    </div>

    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      icon="i-lucide-check-circle"
      title="저장 완료"
      description="설정이 성공적으로 저장되었습니다."
    />

    <!-- 일반 설정 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sliders" class="w-4 h-4 text-gray-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">일반</h3>
        </div>
      </template>

      <div class="space-y-4">
        <UFormField label="사이트 이름" name="siteName">
          <UInput v-model="generalForm.siteName" class="w-full" />
        </UFormField>

        <UFormField label="사이트 URL" name="siteUrl">
          <UInput v-model="generalForm.siteUrl" placeholder="https://example.com" class="w-full" />
        </UFormField>

        <UFormField label="지원 이메일" name="supportEmail">
          <UInput v-model="generalForm.supportEmail" type="email" class="w-full" />
        </UFormField>

        <UFormField label="시간대" name="timezone">
          <USelect
            v-model="generalForm.timezone"
            :items="timezones"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- 알림 설정 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-bell" class="w-4 h-4 text-gray-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">알림</h3>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">리포트 완료 시 이메일 알림</p>
            <p class="text-xs text-gray-500 mt-0.5">리포트가 완료되면 이메일을 발송합니다.</p>
          </div>
          <USwitch v-model="notificationForm.emailOnComplete" />
        </div>
        <USeparator />
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">검토 요청 시 이메일 알림</p>
            <p class="text-xs text-gray-500 mt-0.5">검토가 필요한 리포트가 있을 때 알려드립니다.</p>
          </div>
          <USwitch v-model="notificationForm.emailOnReview" />
        </div>
        <USeparator />
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">일일 요약 이메일</p>
            <p class="text-xs text-gray-500 mt-0.5">매일 전체 활동 요약을 발송합니다.</p>
          </div>
          <USwitch v-model="notificationForm.emailDigest" />
        </div>
        <USeparator />
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Slack 연동</p>
            <p class="text-xs text-gray-500 mt-0.5">Slack 채널로 알림을 전송합니다.</p>
          </div>
          <USwitch v-model="notificationForm.slackIntegration" />
        </div>
      </div>
    </UCard>

    <!-- 위험 구역 -->
    <UCard class="border border-red-200 dark:border-red-900">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-triangle-alert" class="w-4 h-4 text-red-500" />
          <h3 class="font-semibold text-red-600 dark:text-red-400">위험 구역</h3>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">전체 데이터 초기화</p>
          <p class="text-xs text-gray-500 mt-0.5">모든 리포트와 사용자 데이터가 영구 삭제됩니다.</p>
        </div>
        <UButton color="error" variant="soft" size="sm" icon="i-lucide-trash-2">
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 저장 버튼 -->
    <div class="flex justify-end">
      <UButton icon="i-lucide-save" @click="saveSettings">
        설정 저장
      </UButton>
    </div>
  </div>
</template>
