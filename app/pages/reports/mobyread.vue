<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const reports = [
  { id: 1, title: 'Q1 2025 분석', author: 'Alice Kim', category: '분기별', date: '2025-04-01', status: 'completed', pages: 42 },
  { id: 2, title: '4월 요약', author: 'Bob Chen', category: '월별', date: '2025-04-10', status: 'in-progress', pages: 18 },
  { id: 3, title: '사용자 성장 Q2', author: 'Carol Lee', category: '성장', date: '2025-04-12', status: 'review', pages: 31 },
  { id: 4, title: '리텐션 분석', author: 'David Park', category: '분석', date: '2025-04-08', status: 'completed', pages: 27 },
  { id: 5, title: '주간 다이제스트 #18', author: 'Emma Wilson', category: '주간', date: '2025-04-15', status: 'in-progress', pages: 9 },
  { id: 6, title: '코호트 분석 3월', author: 'Frank Zhao', category: '분석', date: '2025-04-05', status: 'review', pages: 35 },
  { id: 7, title: '기능 도입률', author: 'Grace Han', category: '프로덕트', date: '2025-03-28', status: 'completed', pages: 22 },
  { id: 8, title: '매출 리포트 Q1', author: 'Henry Liu', category: '재무', date: '2025-03-31', status: 'completed', pages: 54 },
  { id: 9, title: '이탈률 분석', author: 'Iris Park', category: '분석', date: '2025-04-14', status: 'in-progress', pages: 16 },
  { id: 10, title: 'NPS 설문 결과', author: 'James Wong', category: '피드백', date: '2025-04-11', status: 'completed', pages: 28 }
]

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: '리포트 제목' },
  { accessorKey: 'author', header: '작성자' },
  { accessorKey: 'category', header: '카테고리' },
  { accessorKey: 'date', header: '날짜' },
  { accessorKey: 'pages', header: '페이지' },
  { accessorKey: 'status', header: '상태' }
]

const route = useRoute()
const searchQuery = ref((route.query.search as string) || '')

const filteredReports = computed(() => {
  if (!searchQuery.value) return reports
  const q = searchQuery.value.toLowerCase()
  return reports.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.author.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q)
  )
})

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
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Moby Read 리포트</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Moby Read 리포트를 관리하고 검토합니다.</p>
      </div>
      <UButton icon="i-lucide-plus">
        새 리포트
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="리포트 검색..."
            icon="i-lucide-search"
            class="max-w-xs"
          />
          <div class="flex items-center gap-2">
            <UBadge color="neutral" variant="soft">{{ filteredReports.length }}건</UBadge>
          </div>
        </div>
      </template>

      <UTable :data="filteredReports" :columns="columns">
        <template #title-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">{{ row.original.title }}</span>
        </template>
        <template #author-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.author}`"
              :alt="row.original.author"
              size="xs"
            />
            <span class="text-sm">{{ row.original.author }}</span>
          </div>
        </template>
        <template #category-cell="{ row }">
          <UBadge color="neutral" variant="outline" size="sm">{{ row.original.category }}</UBadge>
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
