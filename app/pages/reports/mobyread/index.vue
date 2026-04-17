<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { students, rsaRecords, yeptRecords } = useStudentData()

const allRecords = students.map(s => {
  const rsa = rsaRecords.find(r => r.studentId === s.id)
  const yept = yeptRecords.find(r => r.studentId === s.id)
  return {
    id: s.id,
    name: s.name,
    nickname: s.nickname,
    dob: s.dob,
    academy: s.academy,
    curriculum: s.curriculum,
    day: s.day,
    level: s.level,
    rsaScore: rsa?.score ?? null,
    rsaDate: rsa?.date ?? '-',
    yeptStatus: yept?.status ?? '-',
    yeptLevel: yept?.assignedLevel ?? '-',
  }
})

const academyOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.academy)))]
const curriculumOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.curriculum)))]
const levelOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.level)))]

const route = useRoute()
const filterAcademy = ref('전체')
const filterCurriculum = ref('전체')
const filterLevel = ref('전체')
const filterName = ref((route.query.search as string) || '')

const filteredRecords = computed(() => {
  return allRecords.filter(r => {
    if (filterAcademy.value !== '전체' && r.academy !== filterAcademy.value) return false
    if (filterCurriculum.value !== '전체' && r.curriculum !== filterCurriculum.value) return false
    if (filterLevel.value !== '전체' && r.level !== filterLevel.value) return false
    if (filterName.value.trim() && !r.name.includes(filterName.value.trim()) && !r.nickname.toLowerCase().includes(filterName.value.trim().toLowerCase())) return false
    return true
  })
})

const columns = [
  { accessorKey: 'select',      header: '' },
  { accessorKey: 'name',        header: 'Name' },
  { accessorKey: 'nickname',    header: 'NickName' },
  { accessorKey: 'dob',         header: 'Date of Birth' },
  { accessorKey: 'academy',     header: 'Academy' },
  { accessorKey: 'curriculum',  header: 'Curriculum' },
  { accessorKey: 'day',         header: 'Day' },
  { accessorKey: 'level',       header: 'Level' },
  { accessorKey: 'rsaScore',    header: 'RSA Score' },
  { accessorKey: 'yeptStatus',  header: 'YEPT' },
  { accessorKey: 'aiReport',    header: 'AI Report' },
]

const selectedIds = ref<number[]>([])
const allSelected = computed(() =>
  filteredRecords.value.length > 0 &&
  filteredRecords.value.every(r => selectedIds.value.includes(r.id))
)

function toggleAll() {
  if (allSelected.value) {
    const filteredIds = filteredRecords.value.map(r => r.id)
    selectedIds.value = selectedIds.value.filter(id => !filteredIds.includes(id))
  } else {
    const filteredIds = filteredRecords.value.map(r => r.id)
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...filteredIds]))
  }
}

function toggleRow(id: number) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function rsaColor(score: number | null) {
  if (score === null) return 'neutral'
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  return 'error'
}

function yeptColor(status: string) {
  switch (status) {
    case '완료': return 'success'
    case '대기': return 'warning'
    case '취소': return 'error'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Moby Read 리포트</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">학생별 Moby Read AI 리포트를 조회합니다.</p>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="Academy">
          <USelect v-model="filterAcademy" :items="academyOptions" class="w-44" />
        </UFormField>
        <UFormField label="Curriculum">
          <USelect v-model="filterCurriculum" :items="curriculumOptions" class="w-52" />
        </UFormField>
        <UFormField label="Level">
          <USelect v-model="filterLevel" :items="levelOptions" class="w-36" />
        </UFormField>
        <UFormField label="이름">
          <UInput v-model="filterName" placeholder="이름 검색" icon="i-lucide-search" class="w-36" />
        </UFormField>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="filterAcademy = '전체'; filterCurriculum = '전체'; filterLevel = '전체'; filterName = ''"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 목록 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ filteredRecords.length }}명</span>
        </div>
      </template>

      <UTable :data="filteredRecords" :columns="columns">
        <template #select-header>
          <UCheckbox :model-value="allSelected" @update:model-value="toggleAll" />
        </template>

        <template #select-cell="{ row }">
          <UCheckbox
            :model-value="selectedIds.includes(row.original.id)"
            @update:model-value="toggleRow(row.original.id)"
          />
        </template>

        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>

        <template #rsaScore-cell="{ row }">
          <UBadge
            v-if="row.original.rsaScore !== null"
            :color="rsaColor(row.original.rsaScore)"
            variant="soft"
            size="sm"
          >
            {{ row.original.rsaScore }}점
          </UBadge>
          <span v-else class="text-gray-300 dark:text-gray-600">—</span>
        </template>

        <template #yeptStatus-cell="{ row }">
          <UBadge
            v-if="row.original.yeptStatus !== '-'"
            :color="yeptColor(row.original.yeptStatus)"
            variant="soft"
            size="sm"
          >
            {{ row.original.yeptStatus }}
          </UBadge>
          <span v-else class="text-gray-300 dark:text-gray-600">—</span>
        </template>

        <template #aiReport-cell="{ row }">
          <UButton
            size="sm"
            variant="soft"
            color="primary"
            icon="i-lucide-sparkles"
            :to="`/reports/mobyread/${row.original.id}`"
          >
            AI Report
          </UButton>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
