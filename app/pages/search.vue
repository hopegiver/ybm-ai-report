<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { students, eccRecords, rsaRecords, yeptRecords, onlineRecords } = useStudentData()

const query = ref((route.query.q as string) || '')

watch(query, (val) => {
  router.replace({ query: val ? { q: val } : {} })
})

interface SearchResult {
  studentId: number
  studentName: string
  reportType: string
  reportLabel: string
  to: string
  meta?: string
}

const results = computed<SearchResult[]>(() => {
  const q = query.value.trim()
  if (!q) return []

  const matched = students.filter(s => s.name.includes(q))

  const out: SearchResult[] = []

  for (const s of matched) {
    if (eccRecords.some(r => r.studentId === s.id)) {
      out.push({
        studentId: s.id,
        studentName: s.name,
        reportType: 'ecc-progress',
        reportLabel: 'ECC Progress',
        to: `/reports/ecc-progress/${s.id}`,
        meta: s.curriculum,
      })
    }

    if (rsaRecords.some(r => r.studentId === s.id)) {
      const rsa = rsaRecords.find(r => r.studentId === s.id)!
      out.push({
        studentId: s.id,
        studentName: s.name,
        reportType: 'rsa',
        reportLabel: 'RSA',
        to: `/reports/rsa/${s.id}`,
        meta: `${rsa.cohort} ${rsa.year}`,
      })
    }

    if (yeptRecords.some(r => r.studentId === s.id)) {
      const yept = yeptRecords.find(r => r.studentId === s.id)!
      out.push({
        studentId: s.id,
        studentName: s.name,
        reportType: 'yept',
        reportLabel: 'YEPT',
        to: `/reports/yept/${s.id}`,
        meta: yept.level,
      })
    }

    if (onlineRecords.some(r => r.studentId === s.id)) {
      out.push({
        studentId: s.id,
        studentName: s.name,
        reportType: 'online-scores',
        reportLabel: 'Online Scores',
        to: `/reports/online-scores/${s.id}`,
        meta: s.level,
      })
    }
  }

  return out
})

const reportTypeColor: Record<string, 'primary' | 'info' | 'warning' | 'success'> = {
  'ecc-progress': 'primary',
  'rsa': 'info',
  'yept': 'warning',
  'online-scores': 'success',
}

// 학생별로 그룹핑
const groupedResults = computed(() => {
  const map = new Map<number, { student: typeof students[0], results: SearchResult[] }>()
  for (const r of results.value) {
    if (!map.has(r.studentId)) {
      const s = students.find(st => st.id === r.studentId)!
      map.set(r.studentId, { student: s, results: [] })
    }
    map.get(r.studentId)!.results.push(r)
  }
  return [...map.values()]
})
</script>

<template>
  <div class="p-6 space-y-6 max-w-3xl mx-auto">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">학생 검색</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">이름으로 학생을 검색하면 관련 리포트를 모두 찾아드립니다.</p>
    </div>

    <UInput
      v-model="query"
      placeholder="학생 이름 입력..."
      icon="i-lucide-search"
      size="lg"
      autofocus
      class="w-full"
    />

    <!-- 결과 없음 -->
    <div v-if="query.trim() && groupedResults.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto mb-3 opacity-40" />
      <p class="text-sm">"{{ query }}"에 해당하는 학생이 없습니다.</p>
    </div>

    <!-- 검색 전 안내 -->
    <div v-else-if="!query.trim()" class="text-center py-16 text-gray-400 dark:text-gray-500">
      <UIcon name="i-lucide-users" class="w-10 h-10 mx-auto mb-3 opacity-40" />
      <p class="text-sm">학생 이름을 입력하세요.</p>
    </div>

    <!-- 결과 목록 -->
    <div v-else class="space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <strong class="text-gray-900 dark:text-white">{{ groupedResults.length }}명</strong> 검색됨
        (리포트 {{ results.length }}건)
      </p>

      <UCard v-for="group in groupedResults" :key="group.student.id">
        <template #header>
          <div class="flex items-center gap-3">
            <UAvatar
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.student.name}`"
              :alt="group.student.name"
              size="sm"
            />
            <div>
              <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ group.student.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ group.student.nickname }} · {{ group.student.academy }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <NuxtLink
            v-for="r in group.results"
            :key="r.reportType"
            :to="r.to"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <UBadge :color="reportTypeColor[r.reportType]" variant="soft" size="sm">
                {{ r.reportLabel }}
              </UBadge>
              <span v-if="r.meta" class="text-xs text-gray-500 dark:text-gray-400">{{ r.meta }}</span>
            </div>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>
