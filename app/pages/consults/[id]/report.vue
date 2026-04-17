<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getById, load } = useConsults()
const { getStudentReports, generateAiAnalysis } = useStudentData()

const loaded = ref(false)
onMounted(() => {
  load()
  loaded.value = true
})

const consult = computed(() => getById(route.params.id as string))

watchEffect(() => {
  if (loaded.value && consult.value === null) {
    router.replace('/consults')
  }
})

const reports = computed(() => {
  if (!consult.value) return null
  return getStudentReports(consult.value.studentId)
})

const aiAnalysis = computed(() => {
  if (!consult.value) return null
  return generateAiAnalysis(consult.value.studentId)
})

const dailyScores = computed(() => {
  const d = reports.value?.online?.daily ?? []
  return d.filter(s => s !== null) as number[]
})

const avgDaily = computed(() => {
  if (!dailyScores.value.length) return null
  return Math.round(dailyScores.value.reduce((a, b) => a + b, 0) / dailyScores.value.length)
})

function scoreColor(score: number) {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 80) return 'text-blue-600 dark:text-blue-400'
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const statusColor = (s: string) => {
  if (s === '완료') return 'success'
  if (s === '진행중') return 'info'
  return 'warning'
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div v-if="consult && reports" class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/consults" />
        <div>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-bar-chart" class="w-5 h-5 text-info-500" />
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ consult.studentName }} AI 통합 리포트
            </h2>
            <UBadge :color="statusColor(consult.status)" variant="soft">{{ consult.status }}</UBadge>
          </div>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ consult.academy }} · {{ consult.curriculum }} · {{ consult.level }}
          </p>
        </div>
      </div>
      <UButton variant="soft" color="neutral" icon="i-lucide-printer" @click="handlePrint">
        인쇄
      </UButton>
    </div>

    <!-- 학생 기본 정보 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-500" />
          <span class="font-medium text-sm text-gray-900 dark:text-white">학생 기본 정보</span>
        </div>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-gray-500">학생명</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ reports.student?.name }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">학원</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.academy }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">커리큘럼</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.curriculum }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">현재 레벨</p>
          <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">{{ consult.level }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">담당강사</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.consultant }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">수업 요일</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ reports.student?.day }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">상담 예정일</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.scheduledAt }}</p>
        </div>
        <div v-if="consult.completedAt">
          <p class="text-xs text-gray-500">상담 완료일</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
            {{ new Date(consult.completedAt).toLocaleDateString('ko-KR') }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- 리포트 데이터 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- ECC Progress -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-green-500" />
            <span class="font-medium text-sm">ECC Progress</span>
          </div>
        </template>
        <div v-if="reports.ecc" class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Evaluation</span>
            <span class="font-semibold">{{ reports.ecc.eval !== '-' ? reports.ecc.eval : '—' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Confirmed</span>
            <UBadge :color="reports.ecc.confirmed ? 'success' : 'neutral'" variant="soft" size="xs">
              {{ reports.ecc.confirmed ? '확인됨' : '미확인' }}
            </UBadge>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">데이터 없음</p>
      </UCard>

      <!-- Online Scores -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-monitor" class="w-4 h-4 text-blue-500" />
            <span class="font-medium text-sm">Online Scores</span>
          </div>
        </template>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Daily 평균</span>
            <span :class="avgDaily ? scoreColor(avgDaily) : 'text-gray-400'" class="font-semibold">
              {{ avgDaily !== null ? `${avgDaily}점` : '데이터 없음' }}
            </span>
          </div>
          <div v-if="dailyScores.length" class="flex gap-1 flex-wrap">
            <span
              v-for="(score, i) in dailyScores"
              :key="i"
              :class="scoreColor(score)"
              class="text-xs font-medium bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded"
            >
              {{ score }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">iSeed</span>
            <span class="font-medium">{{ reports.online?.iseed ?? 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">JET M1</span>
            <span class="font-medium">{{ reports.online?.jet ?? '—' }}</span>
          </div>
        </div>
      </UCard>

      <!-- RSA -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-award" class="w-4 h-4 text-orange-500" />
            <span class="font-medium text-sm">RSA</span>
          </div>
        </template>
        <div v-if="reports.rsa" class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">점수</span>
            <span :class="scoreColor(reports.rsa.score)" class="font-bold text-xl">{{ reports.rsa.score }}점</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">기수 / 연차</span>
            <span class="font-medium">{{ reports.rsa.cohort }} / {{ reports.rsa.year }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">반</span>
            <span class="font-medium">{{ reports.rsa.class }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">담당강사</span>
            <span class="font-medium">{{ reports.rsa.teacher }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">시험일</span>
            <span class="font-medium">{{ reports.rsa.date }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">데이터 없음</p>
      </UCard>

      <!-- YEPT -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-purple-500" />
            <span class="font-medium text-sm">YEPT</span>
          </div>
        </template>
        <div v-if="reports.yept" class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">응시 레벨</span>
            <span class="font-medium">{{ reports.yept.level }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">배정 레벨</span>
            <span :class="reports.yept.assignedLevel !== '-' ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-400'">
              {{ reports.yept.assignedLevel }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">응시일시</span>
            <span class="font-medium">{{ reports.yept.datetime }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">상태</span>
            <UBadge :color="reports.yept.status === '완료' ? 'success' : reports.yept.status === '취소' ? 'error' : 'warning'" variant="soft" size="xs">
              {{ reports.yept.status }}
            </UBadge>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">데이터 없음</p>
      </UCard>
    </div>

    <!-- AI 통합 분석 -->
    <UCard v-if="aiAnalysis" class="border border-primary-200 dark:border-primary-800">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-bot" class="w-5 h-5 text-primary-500" />
          <span class="font-semibold text-primary-700 dark:text-primary-300">AI 통합 분석</span>
        </div>
      </template>
      <div class="space-y-5">
        <div>
          <p class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">강점</p>
          <ul class="space-y-2">
            <li v-for="(item, i) in aiAnalysis.strengths" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">개선 권장</p>
          <ul class="space-y-2">
            <li v-for="(item, i) in aiAnalysis.improvements" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon name="i-lucide-arrow-up-circle" class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p class="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">종합 의견</p>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ aiAnalysis.recommendation }}</p>
        </div>
      </div>
    </UCard>

    <!-- 상담 메모 (완료된 경우만 표시) -->
    <UCard v-if="consult.status === '완료' && consult.memo">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-message-square" class="w-4 h-4 text-gray-500" />
          <span class="font-medium text-gray-900 dark:text-white">상담 메모</span>
        </div>
      </template>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {{ consult.memo }}
      </p>
      <p v-if="consult.completedAt" class="text-xs text-gray-400 mt-2">
        완료: {{ new Date(consult.completedAt).toLocaleString('ko-KR') }}
      </p>
    </UCard>

    <!-- 하단 액션 -->
    <div class="flex items-center justify-between pt-2">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/consults">
        목록으로
      </UButton>
      <UButton variant="soft" color="primary" icon="i-lucide-bot" :to="`/consults/${consult.id}`">
        상담 페이지로
      </UButton>
    </div>
  </div>
</template>
