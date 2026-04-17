<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const { consults, load, remove } = useConsults()

onMounted(load)

const filterName = ref((route.query.search as string) || '')
const filterStatus = ref('전체')
const statusOptions = ['전체', '대기', '진행중', '완료']

const filtered = computed(() => {
  return consults.value.filter(c => {
    if (filterName.value.trim() && !c.studentName.includes(filterName.value.trim())) return false
    if (filterStatus.value !== '전체' && c.status !== filterStatus.value) return false
    return true
  })
})

const statusColor = (s: string) => {
  if (s === '완료') return 'success'
  if (s === '진행중') return 'info'
  if (s === '대기') return 'warning'
  return 'neutral'
}

const columns = [
  { accessorKey: 'no',          header: '번호' },
  { accessorKey: 'studentName', header: '학생명' },
  { accessorKey: 'academy',     header: '학원' },
  { accessorKey: 'level',       header: '레벨' },
  { accessorKey: 'consultant',  header: '담당강사' },
  { accessorKey: 'scheduledAt', header: '상담예정일' },
  { accessorKey: 'status',      header: '상태' },
  { accessorKey: 'actions',     header: '관리' },
]

function confirmDelete(id: string) {
  if (confirm('상담 등록을 삭제하시겠습니까?')) {
    remove(id)
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI 리포트 상담</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">학생별 통합 리포트를 기반으로 AI 상담을 진행하고 관리합니다.</p>
      </div>
      <UButton icon="i-lucide-plus" to="/consults/new">
        상담 등록
      </UButton>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="학생 이름">
          <UInput v-model="filterName" placeholder="이름 검색" icon="i-lucide-search" class="w-36" />
        </UFormField>
        <UFormField label="상태">
          <USelect v-model="filterStatus" :items="statusOptions" class="w-28" />
        </UFormField>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="filterName = ''; filterStatus = '전체'"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 목록 -->
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <span class="text-sm text-gray-500 dark:text-gray-400">총 {{ filtered.length }}건</span>
      </template>

      <UTable :data="filtered" :columns="columns">
        <template #no-cell="{ row }">
          <span class="text-gray-400 text-xs">{{ row.original.id }}</span>
        </template>

        <template #studentName-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">{{ row.original.studentName }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="soft" size="sm">
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UButton
              size="sm"
              variant="soft"
              color="primary"
              icon="i-lucide-bot"
              :to="`/consults/${row.original.id}`"
            >
              {{ row.original.status === '대기' ? '상담 시작' : row.original.status === '진행중' ? '상담 계속' : '리포트 보기' }}
            </UButton>
            <UButton
              size="sm"
              variant="soft"
              color="info"
              icon="i-lucide-file-bar-chart"
              :to="`/consults/${row.original.id}/report`"
            >
              AI 통합 리포트
            </UButton>
            <UButton
              v-if="row.original.status === '완료'"
              size="sm"
              variant="soft"
              color="neutral"
              icon="i-lucide-share-2"
              :to="`/share/${row.original.shareToken}`"
              target="_blank"
            >
              공유
            </UButton>
            <UButton
              v-if="row.original.status === '대기'"
              size="sm"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="confirmDelete(row.original.id)"
            />
          </div>
        </template>
      </UTable>

      <!-- 빈 상태 -->
      <div v-if="filtered.length === 0" class="py-16 text-center">
        <UIcon name="i-lucide-clipboard-list" class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-sm text-gray-400">등록된 상담이 없습니다.</p>
        <UButton class="mt-4" variant="soft" icon="i-lucide-plus" to="/consults/new">
          첫 상담 등록하기
        </UButton>
      </div>
    </UCard>
  </div>
</template>
