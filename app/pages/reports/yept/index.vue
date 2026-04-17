<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

interface YeptRecord {
  id: number
  academy: string
  applicant: string
  school: string
  level: string
  datetime: string
  status: '완료' | '대기' | '취소'
  assignedLevel: string
}

const { students, yeptRecords } = useStudentData()

// school 정보는 useStudentData에 없으므로 별도 보완
const schoolMap: Record<number, string> = {
  1: '도곡초등학교', 2: '개포초등학교', 3: '서초초등학교', 4: '반포유치원',
  5: '잠실초등학교', 6: '문정초등학교', 7: '강동초등학교', 8: '명덕유치원',
  9: '마포초등학교', 10: '망원유치원',
}

const allRecords: YeptRecord[] = yeptRecords.map(r => {
  const s = students.find(st => st.id === r.studentId)!
  return { id: r.studentId, academy: s.academy, applicant: s.name, school: schoolMap[r.studentId] ?? '', level: r.level, datetime: r.datetime, status: r.status, assignedLevel: r.assignedLevel }
})

const route = useRoute()
const filterName = ref((route.query.search as string) || '')

const filteredRecords = computed(() => {
  const q = filterName.value.trim()
  if (!q) return allRecords
  return allRecords.filter(r => r.applicant.includes(q))
})

const columns = [
  { accessorKey: 'no',           header: '번호' },
  { accessorKey: 'academy',      header: '학원' },
  { accessorKey: 'applicant',    header: '응시자' },
  { accessorKey: 'school',       header: '학교(유치원)' },
  { accessorKey: 'level',        header: '응시레벨' },
  { accessorKey: 'datetime',     header: '일시' },
  { accessorKey: 'status',       header: '상태' },
  { accessorKey: 'assignedLevel', header: '배정레벨' },
  { accessorKey: 'manage',       header: '관리' },
]

const statusColor = (status: YeptRecord['status']) => {
  if (status === '완료') return 'success'
  if (status === '대기') return 'warning'
  return 'error'
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">YEPT 리포트</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">YEPT 응시 결과를 관리하고 검토합니다.</p>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex items-end gap-4">
        <UFormField label="이름 검색">
          <UInput v-model="filterName" placeholder="이름으로 검색해 주세요." icon="i-lucide-search" class="w-64" />
        </UFormField>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="filterName = ''"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 목록 -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <template #header>
        <span class="text-sm text-gray-500 dark:text-gray-400">총 건수 : {{ filteredRecords.length }} 건</span>
      </template>

      <UTable :data="filteredRecords" :columns="columns">
        <template #no-cell="{ row }">
          <span class="text-gray-500">{{ row.original.id }}</span>
        </template>

        <template #applicant-cell="{ row }">
          <span class="font-medium">{{ row.original.applicant }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="soft">
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #assignedLevel-cell="{ row }">
          <span :class="row.original.assignedLevel === '-' ? 'text-gray-400' : 'font-medium text-primary-600 dark:text-primary-400'">
            {{ row.original.assignedLevel }}
          </span>
        </template>

        <template #manage-cell="{ row }">
          <UButton
            v-if="row.original.status === '완료'"
            size="sm"
            variant="soft"
            color="primary"
            icon="i-lucide-sparkles"
            :to="`/reports/yept/${row.original.id}`"
          >
            AI Report
          </UButton>
          <span v-else class="text-gray-300 dark:text-gray-600 text-sm">—</span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
