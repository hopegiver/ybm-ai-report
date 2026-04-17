<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { students, eccRecords } = useStudentData()

const allRecords = students.map(s => {
  const ecc = eccRecords.find(e => e.studentId === s.id)
  return { id: s.id, name: s.name, nickname: s.nickname, dob: s.dob, curriculum: s.curriculum, day: s.day, level: s.level, eval: ecc?.eval ?? '-', confirmed: ecc?.confirmed ?? false }
})

const curriculumOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.curriculum)))]
const dayOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.day)))]
const levelOptions = ['전체', ...Array.from(new Set(allRecords.map(r => r.level)))]

const route = useRoute()
const filterCurriculum = ref('전체')
const filterDay = ref('전체')
const filterLevel = ref('전체')
const filterName = ref((route.query.search as string) || '')

const filteredRecords = computed(() => {
  return allRecords.filter(r => {
    if (filterCurriculum.value !== '전체' && r.curriculum !== filterCurriculum.value) return false
    if (filterDay.value !== '전체' && r.day !== filterDay.value) return false
    if (filterLevel.value !== '전체' && r.level !== filterLevel.value) return false
    if (filterName.value.trim() && !r.name.includes(filterName.value.trim())) return false
    return true
  })
})

const columns = [
  { accessorKey: 'select',     header: '' },
  { accessorKey: 'name',       header: 'Name' },
  { accessorKey: 'nickname',   header: 'NickName' },
  { accessorKey: 'dob',        header: 'Date of Birth' },
  { accessorKey: 'curriculum', header: 'Curriculum' },
  { accessorKey: 'day',        header: 'Day' },
  { accessorKey: 'level',      header: 'Level' },
  { accessorKey: 'eval',       header: 'Eval.' },
  { accessorKey: 'confirmed',  header: 'Confirmed' },
  { accessorKey: 'progress',   header: 'Progress Report' },
  { accessorKey: 'ai',         header: 'AI Report' },
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
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ecc Progress 리포트</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Ecc Progress 리포트를 관리하고 검토합니다.</p>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="Curriculum">
          <USelect v-model="filterCurriculum" :items="curriculumOptions" class="w-52" />
        </UFormField>
        <UFormField label="Day">
          <USelect v-model="filterDay" :items="dayOptions" class="w-52" />
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
          @click="filterCurriculum = '전체'; filterDay = '전체'; filterLevel = '전체'; filterName = ''"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 목록 -->
    <UCard :ui="{ body: { padding: 'p-0' } }">
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

        <template #confirmed-cell="{ row }">
          <span v-if="row.original.confirmed" class="text-lg">🚨</span>
          <span v-else class="text-gray-300 dark:text-gray-600">—</span>
        </template>

        <template #progress-cell>
          <UButton size="sm" variant="outline" color="neutral" icon="i-lucide-external-link">View</UButton>
        </template>

        <template #ai-cell="{ row }">
          <UButton
            size="sm"
            variant="soft"
            color="primary"
            icon="i-lucide-sparkles"
            :to="`/reports/ecc-progress/${row.original.id}`"
          >
            AI Report
          </UButton>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
