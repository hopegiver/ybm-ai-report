<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const stats = [
  {
    label: '전체 리포트',
    value: '1,284',
    change: '+12%',
    icon: 'i-lucide-file-bar-chart',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    label: '활성 사용자',
    value: '342',
    change: '+8%',
    icon: 'i-lucide-users',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950'
  },
  {
    label: '이번 달',
    value: '186',
    change: '+23%',
    icon: 'i-lucide-calendar',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950'
  },
  {
    label: '완료율',
    value: '94.2%',
    change: '+2.1%',
    icon: 'i-lucide-check-circle',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950'
  }
]

// 월별 리포트 데이터
const monthlyData = [
  { month: '11월', count: 98 },
  { month: '12월', count: 112 },
  { month: '1월', count: 87 },
  { month: '2월', count: 134 },
  { month: '3월', count: 121 },
  { month: '4월', count: 186 }
]
const maxCount = Math.max(...monthlyData.map(d => d.count))

// 최근 리포트 목록
const recentReports = [
  { id: 1, title: 'Q1 2025 Moby Read 분석', type: 'mobyread', author: 'Alice Kim', date: '2025-04-15', status: 'completed' },
  { id: 2, title: '4월 ECC Progress 요약', type: 'ecc', author: 'Bob Chen', date: '2025-04-14', status: 'in-progress' },
  { id: 3, title: '사용자 성장 Q2 분석', type: 'online', author: 'Carol Lee', date: '2025-04-13', status: 'review' },
  { id: 4, title: '리텐션 RSA 분석', type: 'rsa', author: 'David Park', date: '2025-04-12', status: 'completed' },
  { id: 5, title: 'YEPT 주간 다이제스트 #18', type: 'yept', author: 'Emma Wilson', date: '2025-04-11', status: 'in-progress' }
]

// 알림 데이터
const notifications = [
  { id: 1, type: 'info', message: '4월 월간 리포트 마감일이 3일 남았습니다.', time: '방금 전' },
  { id: 2, type: 'success', message: 'Q1 2025 Moby Read 분석 리포트가 완료되었습니다.', time: '1시간 전' },
  { id: 3, type: 'warning', message: '사용자 성장 Q2 리포트 검토 요청이 있습니다.', time: '3시간 전' }
]

const recentActivity = [
  { id: 1, user: 'Alice Kim', action: '리포트 완료', report: 'Q1 2025 분석', time: '2분 전', status: 'completed' },
  { id: 2, user: 'Bob Chen', action: '리포트 시작', report: '4월 요약', time: '15분 전', status: 'in-progress' },
  { id: 3, user: 'Carol Lee', action: '검토 요청', report: '사용자 성장 Q2', time: '32분 전', status: 'review' },
  { id: 4, user: 'David Park', action: '리포트 완료', report: '리텐션 분석', time: '1시간 전', status: 'completed' },
  { id: 5, user: 'Emma Wilson', action: '리포트 시작', report: '주간 다이제스트 #18', time: '2시간 전', status: 'in-progress' },
  { id: 6, user: 'Frank Zhao', action: '검토 요청', report: '코호트 분석 3월', time: '3시간 전', status: 'review' }
]

const columns = [
  { accessorKey: 'user', header: '사용자' },
  { accessorKey: 'action', header: '액션' },
  { accessorKey: 'report', header: '리포트' },
  { accessorKey: 'time', header: '시간' },
  { accessorKey: 'status', header: '상태' }
]

function statusColor(status: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'in-progress': return 'info'
    case 'review': return 'warning'
    default: return 'neutral'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'completed': return '완료'
    case 'in-progress': return '진행 중'
    case 'review': return '검토 중'
    default: return status
  }
}

function reportTypeLabel(type: string) {
  switch (type) {
    case 'mobyread': return 'Moby Read'
    case 'ecc': return 'ECC'
    case 'online': return 'Online'
    case 'rsa': return 'RSA'
    case 'yept': return 'YEPT'
    default: return type
  }
}

function notificationColor(type: string) {
  switch (type) {
    case 'info': return 'info'
    case 'success': return 'success'
    case 'warning': return 'warning'
    default: return 'neutral'
  }
}

function notificationIcon(type: string) {
  switch (type) {
    case 'info': return 'i-lucide-info'
    case 'success': return 'i-lucide-check-circle'
    case 'warning': return 'i-lucide-alert-triangle'
    default: return 'i-lucide-bell'
  }
}

const dismissedNotifications = ref<number[]>([])
function dismiss(id: number) {
  dismissedNotifications.value.push(id)
}
const visibleNotifications = computed(() =>
  notifications.filter(n => !dismissedNotifications.value.includes(n.id))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">대시보드</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">안녕하세요, 관리자님. 오늘의 현황입니다.</p>
    </div>

    <!-- 알림/공지 섹션 -->
    <div v-if="visibleNotifications.length > 0" class="space-y-2">
      <div
        v-for="notif in visibleNotifications"
        :key="notif.id"
        class="flex items-start gap-3 px-4 py-3 rounded-lg border"
        :class="{
          'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800': notif.type === 'info',
          'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800': notif.type === 'success',
          'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800': notif.type === 'warning'
        }"
      >
        <UIcon
          :name="notificationIcon(notif.type)"
          class="w-4 h-4 mt-0.5 flex-shrink-0"
          :class="{
            'text-blue-500': notif.type === 'info',
            'text-green-500': notif.type === 'success',
            'text-amber-500': notif.type === 'warning'
          }"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-800 dark:text-gray-200">{{ notif.message }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ notif.time }}</p>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
          @click="dismiss(notif.id)"
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <div class="flex items-center gap-1 mt-1">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 text-green-500" />
              <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ stat.change }}</span>
              <span class="text-xs text-gray-400">전월 대비</span>
            </div>
          </div>
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', stat.bg]">
            <UIcon :name="stat.icon" :class="['w-5 h-5', stat.color]" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 차트 + 최근 리포트 -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-4">
      <!-- 월별 리포트 차트 -->
      <UCard class="xl:col-span-3">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">월별 리포트 현황</h3>
            <span class="text-xs text-gray-400">최근 6개월</span>
          </div>
        </template>
        <div class="flex items-end gap-3 h-40 px-2">
          <div
            v-for="item in monthlyData"
            :key="item.month"
            class="flex-1 flex flex-col items-center gap-1"
          >
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ item.count }}</span>
            <div class="w-full rounded-t-md bg-blue-500 dark:bg-blue-400 transition-all duration-500"
              :style="{ height: `${(item.count / maxCount) * 100}px` }"
            />
            <span class="text-xs text-gray-400">{{ item.month }}</span>
          </div>
        </div>
      </UCard>

      <!-- 최근 리포트 목록 -->
      <UCard class="xl:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">최근 리포트</h3>
            <UButton variant="ghost" color="neutral" size="sm" to="/reports">
              전체 보기
              <template #trailing>
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
              </template>
            </UButton>
          </div>
        </template>
        <div class="space-y-3">
          <div
            v-for="report in recentReports"
            :key="report.id"
            class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-blue-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ report.title }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-gray-400">{{ report.author }}</span>
                <span class="text-xs text-gray-300 dark:text-gray-600">·</span>
                <span class="text-xs text-gray-400">{{ report.date }}</span>
              </div>
            </div>
            <UBadge :color="statusColor(report.status)" variant="soft" size="sm" class="flex-shrink-0">
              {{ statusLabel(report.status) }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 최근 활동 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">최근 활동</h3>
          <UButton variant="ghost" color="neutral" size="sm" to="/reports">
            전체 보기
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </template>
          </UButton>
        </div>
      </template>

      <UTable :data="recentActivity" :columns="columns">
        <template #user-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.user}`"
              :alt="row.original.user"
              size="xs"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ row.original.user }}</span>
          </div>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="soft" size="sm">
            {{ statusLabel(row.original.status) }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
