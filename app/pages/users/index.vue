<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const users = [
  { id: 1, name: 'Alice Kim', email: 'alice@mobyread.ai', role: '관리자', department: '개발', reports: 34, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Bob Chen', email: 'bob@mobyread.ai', role: '분석가', department: '프로덕트', reports: 21, joined: '2024-02-08', status: 'active' },
  { id: 3, name: 'Carol Lee', email: 'carol@mobyread.ai', role: '분석가', department: '마케팅', reports: 17, joined: '2024-03-20', status: 'active' },
  { id: 4, name: 'David Park', email: 'david@mobyread.ai', role: '매니저', department: '영업', reports: 29, joined: '2023-11-05', status: 'active' },
  { id: 5, name: 'Emma Wilson', email: 'emma@mobyread.ai', role: '분석가', department: '개발', reports: 12, joined: '2024-04-01', status: 'active' },
  { id: 6, name: 'Frank Zhao', email: 'frank@mobyread.ai', role: '분석가', department: '재무', reports: 41, joined: '2023-09-14', status: 'inactive' },
  { id: 7, name: 'Grace Han', email: 'grace@mobyread.ai', role: '매니저', department: '프로덕트', reports: 38, joined: '2023-07-22', status: 'active' },
  { id: 8, name: 'Henry Liu', email: 'henry@mobyread.ai', role: '분석가', department: '재무', reports: 25, joined: '2024-01-30', status: 'active' }
]

const columns = [
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'email', header: '이메일' },
  { accessorKey: 'role', header: '역할' },
  { accessorKey: 'department', header: '부서' },
  { accessorKey: 'reports', header: '리포트 수' },
  { accessorKey: 'joined', header: '가입일' },
  { accessorKey: 'status', header: '상태' },
  { accessorKey: 'actions', header: '리포트 바로가기' }
]

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users
  const q = searchQuery.value.toLowerCase()
  return users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.department.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q)
  )
})

function roleColor(role: string) {
  switch (role) {
    case '관리자': return 'error'
    case '매니저': return 'warning'
    case '분석가': return 'info'
    default: return 'neutral'
  }
}

const reportLinks = [
  { label: 'Moby Read', to: '/reports/mobyread', icon: 'i-lucide-book-open', color: 'info' as const },
  { label: 'ECC Progress', to: '/reports/ecc-progress', icon: 'i-lucide-trending-up', color: 'success' as const },
  { label: 'Online Score', to: '/reports/online-scores', icon: 'i-lucide-monitor', color: 'warning' as const },
  { label: 'RSA', to: '/reports/rsa', icon: 'i-lucide-award', color: 'error' as const },
  { label: 'YEPT', to: '/reports/yept', icon: 'i-lucide-file-text', color: 'primary' as const },
  { label: 'AI 리포트 상담', to: '/consults', icon: 'i-lucide-message-circle', color: 'neutral' as const },
]
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">사용자</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">팀 구성원과 접근 권한을 관리합니다.</p>
      </div>
      <UButton icon="i-lucide-user-plus">
        사용자 초대
      </UButton>
    </div>

    <!-- 요약 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <UIcon name="i-lucide-users" class="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">전체 사용자</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ users.length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
            <UIcon name="i-lucide-user-check" class="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">활성</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ users.filter(u => u.status === 'active').length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-lucide-user-x" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">비활성</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ users.filter(u => u.status === 'inactive').length }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="사용자 검색..."
            icon="i-lucide-search"
            class="max-w-xs"
          />
        </div>
      </template>

      <UTable :data="filteredUsers" :columns="columns">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.name}`"
              :alt="row.original.name"
              size="sm"
            />
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ row.original.name }}</p>
          </div>
        </template>
        <template #role-cell="{ row }">
          <UBadge :color="roleColor(row.original.role)" variant="soft" size="sm">{{ row.original.role }}</UBadge>
        </template>
        <template #status-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <span
              :class="[
                'inline-block w-1.5 h-1.5 rounded-full',
                row.original.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              ]"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ row.original.status === 'active' ? '활성' : '비활성' }}
            </span>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="link in reportLinks"
              :key="link.label"
              :to="`${link.to}?search=${encodeURIComponent(row.original.name)}`"
              :icon="link.icon"
              :color="link.color"
              variant="soft"
              size="xs"
            >
              {{ link.label }}
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
