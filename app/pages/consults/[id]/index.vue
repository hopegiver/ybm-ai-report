<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getById, startConsult, complete, load } = useConsults()
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

const memo = ref('')
watchEffect(() => {
  if (consult.value?.memo) memo.value = consult.value.memo
})

const isSaving = ref(false)

async function handleComplete() {
  if (!consult.value) return
  isSaving.value = true
  await nextTick()
  complete(consult.value.id, memo.value)
  isSaving.value = false
}

function handleStart() {
  if (!consult.value) return
  startConsult(consult.value.id)
}

function copyShareLink() {
  if (!consult.value) return
  const url = `${window.location.origin}/share/${consult.value.shareToken}`
  navigator.clipboard.writeText(url)
}

const statusColor = (s: string) => {
  if (s === '완료') return 'success'
  if (s === '진행중') return 'info'
  return 'warning'
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 80) return 'text-blue-600 dark:text-blue-400'
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const dailyScores = computed(() => {
  const d = reports.value?.online?.daily ?? []
  return d.filter(s => s !== null) as number[]
})
const avgDaily = computed(() => {
  if (!dailyScores.value.length) return null
  return Math.round(dailyScores.value.reduce((a, b) => a + b, 0) / dailyScores.value.length)
})
</script>

<template>
  <div v-if="consult" class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/consults" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ consult.studentName }} AI 리포트 상담</h2>
            <UBadge :color="statusColor(consult.status)" variant="soft">{{ consult.status }}</UBadge>
          </div>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ consult.academy }} · 상담 예정일: {{ consult.scheduledAt }} · 담당: {{ consult.consultant }}
          </p>
        </div>
      </div>
      <div v-if="consult.status === '완료'" class="flex items-center gap-2">
        <UButton variant="soft" color="neutral" icon="i-lucide-copy" @click="copyShareLink">
          링크 복사
        </UButton>
        <UButton variant="soft" color="primary" icon="i-lucide-share-2" :to="`/share/${consult.shareToken}`" target="_blank">
          공유 페이지
        </UButton>
      </div>
    </div>

    <!-- 학생 기본 정보 -->
    <UCard>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-gray-500">학원</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.academy }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">커리큘럼</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ consult.curriculum }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">레벨</p>
          <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">{{ consult.level }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">등록일</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
            {{ new Date(consult.createdAt).toLocaleDateString('ko-KR') }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- 리포트 데이터 요약 -->
    <div v-if="reports" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-green-500" />
            <span class="font-medium text-sm">ECC Progress</span>
          </div>
        </template>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Evaluation</span>
            <span class="font-medium">{{ reports.ecc?.eval ?? '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Confirmed</span>
            <UBadge :color="reports.ecc?.confirmed ? 'success' : 'neutral'" variant="soft" size="xs">
              {{ reports.ecc?.confirmed ? '확인됨' : '미확인' }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-monitor" class="w-4 h-4 text-blue-500" />
            <span class="font-medium text-sm">Online Scores</span>
          </div>
        </template>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Daily 평균</span>
            <span :class="avgDaily ? scoreColor(avgDaily) : ''" class="font-semibold">
              {{ avgDaily !== null ? `${avgDaily}점` : '데이터 없음' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">iSeed</span>
            <span class="font-medium">{{ reports.online?.iseed ?? 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">JET M1</span>
            <span class="font-medium">{{ reports.online?.jet ?? '—' }}</span>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-award" class="w-4 h-4 text-orange-500" />
            <span class="font-medium text-sm">RSA</span>
          </div>
        </template>
        <div v-if="reports.rsa" class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">점수</span>
            <span :class="scoreColor(reports.rsa.score)" class="font-semibold text-base">{{ reports.rsa.score }}점</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">기수 / 연차</span>
            <span class="font-medium">{{ reports.rsa.cohort }} / {{ reports.rsa.year }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">담당강사</span>
            <span class="font-medium">{{ reports.rsa.teacher }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">데이터 없음</p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-purple-500" />
            <span class="font-medium text-sm">YEPT</span>
          </div>
        </template>
        <div v-if="reports.yept" class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">응시 레벨</span>
            <span class="font-medium">{{ reports.yept.level }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">배정 레벨</span>
            <span :class="reports.yept.assignedLevel !== '-' ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-400'">
              {{ reports.yept.assignedLevel }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">상태</span>
            <UBadge :color="reports.yept.status === '완료' ? 'success' : 'warning'" variant="soft" size="xs">
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
          <UIcon name="i-lucide-bot" class="w-4 h-4 text-primary-500" />
          <span class="font-semibold text-primary-700 dark:text-primary-300">AI 통합 분석</span>
        </div>
      </template>
      <div class="space-y-4">
        <div>
          <p class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">강점</p>
          <ul class="space-y-1.5">
            <li v-for="(item, i) in aiAnalysis.strengths" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">개선 권장</p>
          <ul class="space-y-1.5">
            <li v-for="(item, i) in aiAnalysis.improvements" :key="i" class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon name="i-lucide-arrow-up-circle" class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="pt-2 border-t border-gray-100 dark:border-gray-800">
          <p class="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">종합 의견</p>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ aiAnalysis.recommendation }}</p>
        </div>
      </div>
    </UCard>

    <!-- 상담 메모 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-message-square" class="w-4 h-4 text-gray-500" />
          <span class="font-medium text-gray-900 dark:text-white">상담 메모</span>
        </div>
      </template>

      <div v-if="consult.status === '완료'">
        <p v-if="consult.memo" class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {{ consult.memo }}
        </p>
        <p v-else class="text-sm text-gray-400 italic">메모 없음</p>
        <p v-if="consult.completedAt" class="text-xs text-gray-400 mt-2">
          완료: {{ new Date(consult.completedAt).toLocaleString('ko-KR') }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <UButton
          v-if="consult.status === '대기'"
          variant="soft"
          color="info"
          icon="i-lucide-play"
          @click="handleStart"
        >
          상담 시작
        </UButton>
        <textarea
          v-model="memo"
          :disabled="consult.status === '대기'"
          rows="5"
          placeholder="상담 내용을 입력하세요..."
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div class="flex justify-end">
          <UButton
            :disabled="consult.status !== '진행중' || !memo.trim()"
            :loading="isSaving"
            icon="i-lucide-check-circle"
            color="success"
            @click="handleComplete"
          >
            상담 완료
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
