<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// 학기 옵션
const semesterOptions = ['2025년 2학기', '2025년 1학기', '2024년 2학기', '2024년 1학기']
const selectedSemester = ref('2025년 2학기')

// 기수 옵션
const cohortOptions = ['기수 선택', '1기', '2기', '3기', '4기', '5기']
const selectedCohort = ref('기수 선택')

// 연차 옵션 (기수 선택 후 활성화)
const yearOptions = computed(() => {
  if (selectedCohort.value === '기수 선택') return ['연차 선택']
  return ['연차 선택', '1연차', '2연차', '3연차']
})
const selectedYear = ref('연차 선택')

// 기수 변경 시 연차 초기화
watch(selectedCohort, () => {
  selectedYear.value = '연차 선택'
})

const route = useRoute()
const searchName = ref((route.query.search as string) || '')
const showByClass = ref(false)

const { students, rsaRecords } = useStudentData()

const allData = rsaRecords.map(r => {
  const s = students.find(st => st.id === r.studentId)!
  return { id: r.studentId, academy: s.academy, cohort: r.cohort, year: r.year, applicant: s.name, class: r.class, teacher: r.teacher, score: r.score, date: r.date }
})

const deadline = '2026.01.30'

// 필터링
const filteredData = computed(() => {
  let data = allData.filter(d => {
    const cohortMatch = selectedCohort.value === '기수 선택' || d.cohort === selectedCohort.value
    const yearMatch = selectedYear.value === '연차 선택' || d.year === selectedYear.value
    const nameMatch = !searchName.value || d.applicant.includes(searchName.value)
    return cohortMatch && yearMatch && nameMatch
  })

  if (showByClass.value) {
    data = [...data].sort((a, b) => a.class.localeCompare(b.class))
  }

  return data
})

const columns = [
  { accessorKey: 'id', header: '번호' },
  { accessorKey: 'academy', header: '학원' },
  { accessorKey: 'cohort', header: '기수' },
  { accessorKey: 'year', header: '연차' },
  { accessorKey: 'applicant', header: '응시자' },
  { accessorKey: 'class', header: '클래스' },
  { accessorKey: 'teacher', header: '강사' },
  { accessorKey: 'score', header: '점수' },
  { accessorKey: 'date', header: '일시' },
  { accessorKey: 'ai', header: 'AI Report' },
]

function scoreColor(score: number) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  return 'error'
}
</script>

<template>
  <div class="p-6 space-y-4">
    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">RSA 리포트</h2>
      </div>
      <span class="text-sm text-gray-500">[기수 완료]</span>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="학기">
          <USelect v-model="selectedSemester" :items="semesterOptions" class="w-36" />
        </UFormField>
        <UFormField label="기수">
          <USelect v-model="selectedCohort" :items="cohortOptions" class="w-28" />
        </UFormField>
        <UFormField label="연차">
          <USelect v-model="selectedYear" :items="yearOptions" :disabled="selectedCohort === '기수 선택'" class="w-28" />
        </UFormField>
        <UFormField label="이름">
          <UInput v-model="searchName" placeholder="이름 검색" class="w-36" />
        </UFormField>
        <UFormField label="클래스별 보기">
          <UCheckbox v-model="showByClass" />
        </UFormField>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="selectedSemester = '2025년 2학기'; selectedCohort = '기수 선택'; selectedYear = '연차 선택'; searchName = ''; showByClass = false"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <!-- 목록 -->
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center gap-6 text-sm">
          <span class="text-gray-700 dark:text-gray-300">· 총 건수 : <strong>{{ filteredData.length }}</strong> 건</span>
          <span class="text-red-500 font-medium">· 마감일 : {{ deadline }}</span>
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #score-cell="{ row }">
          <UBadge :color="scoreColor(row.original.score)" variant="soft" size="sm">
            {{ row.original.score }}
          </UBadge>
        </template>
        <template #ai-cell="{ row }">
          <UButton
            size="sm"
            variant="soft"
            color="primary"
            icon="i-lucide-sparkles"
            :to="`/reports/rsa/${row.original.id}`"
          >
            AI Report
          </UButton>
        </template>
        <template #empty>
          <div class="py-10 text-center text-sm text-gray-400">데이터가 없습니다.</div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
