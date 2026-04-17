<script setup lang="ts">
// 인증 불필요 — 미들웨어/레이아웃 없음
definePageMeta({ layout: false })

const route = useRoute()
const { load, getByToken } = useConsults()
const { getStudentReports, generateAiAnalysis, getStudent } = useStudentData()

onMounted(load)

const consult = computed(() => getByToken(route.params.token as string))

const reports = computed(() => {
  if (!consult.value) return null
  return getStudentReports(consult.value.studentId)
})

const aiAnalysis = computed(() => {
  if (!consult.value) return null
  return generateAiAnalysis(consult.value.studentId)
})

const student = computed(() => {
  if (!consult.value) return null
  return getStudent(consult.value.studentId)
})

function scoreColor(score: number) {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
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
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <!-- 유효하지 않은 토큰 -->
    <div v-if="!consult" class="max-w-lg mx-auto text-center py-20">
      <UIcon name="i-lucide-file-x" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-lg font-semibold text-gray-600">리포트를 찾을 수 없습니다.</p>
      <p class="text-sm text-gray-400 mt-1">링크가 만료되었거나 잘못된 주소입니다.</p>
    </div>

    <!-- 완료되지 않은 상담 -->
    <div v-else-if="consult.status !== '완료'" class="max-w-lg mx-auto text-center py-20">
      <UIcon name="i-lucide-clock" class="w-12 h-12 text-yellow-400 mx-auto mb-4" />
      <p class="text-lg font-semibold text-gray-600">아직 상담이 완료되지 않았습니다.</p>
      <p class="text-sm text-gray-400 mt-1">상담이 완료되면 리포트를 확인하실 수 있습니다.</p>
    </div>

    <!-- 공유 리포트 -->
    <div v-else class="max-w-3xl mx-auto space-y-6">
      <!-- 헤더 -->
      <div class="text-center pb-2">
        <div class="flex items-center justify-center gap-2 mb-3">
          <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <UIcon name="i-lucide-book-open" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-gray-800">YBM AI Report</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ consult.studentName }} 학생 상담 리포트</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ consult.academy }} · 상담일: {{ consult.scheduledAt }} · 담당강사: {{ consult.consultant }}
        </p>
      </div>

      <!-- 학생 기본 정보 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-400" />
          학생 정보
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p class="text-gray-400 text-xs mb-0.5">커리큘럼</p>
            <p class="font-semibold text-gray-800">{{ consult.curriculum }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">현재 레벨</p>
            <p class="font-semibold text-blue-600">{{ consult.level }}</p>
          </div>
          <div v-if="student">
            <p class="text-gray-400 text-xs mb-0.5">수업 요일</p>
            <p class="font-semibold text-gray-800">{{ student.day }}</p>
          </div>
          <div v-if="reports?.yept?.assignedLevel && reports.yept.assignedLevel !== '-'">
            <p class="text-gray-400 text-xs mb-0.5">YEPT 배정</p>
            <p class="font-semibold text-purple-600">{{ reports.yept.assignedLevel }}</p>
          </div>
        </div>
      </div>

      <!-- 리포트 요약 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-if="reports?.rsa" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
          <p class="text-xs text-gray-400 mb-1">RSA 점수</p>
          <p :class="scoreColor(reports.rsa.score)" class="text-3xl font-bold">{{ reports.rsa.score }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ reports.rsa.cohort }} {{ reports.rsa.year }}</p>
        </div>
        <div v-if="avgDaily !== null" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
          <p class="text-xs text-gray-400 mb-1">Daily 학습 평균</p>
          <p :class="scoreColor(avgDaily)" class="text-3xl font-bold">{{ avgDaily }}</p>
          <p class="text-xs text-gray-400 mt-1">점</p>
        </div>
        <div v-if="reports?.online?.iseed" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
          <p class="text-xs text-gray-400 mb-1">iSeed</p>
          <p class="text-3xl font-bold text-gray-800">{{ reports.online.iseed }}</p>
          <p class="text-xs text-gray-400 mt-1">누적 점수</p>
        </div>
      </div>

      <!-- AI 분석 -->
      <div v-if="aiAnalysis" class="bg-white rounded-2xl shadow-sm border border-primary-100 p-6">
        <h2 class="text-base font-semibold text-primary-700 mb-5 flex items-center gap-2">
          <UIcon name="i-lucide-bot" class="w-4 h-4 text-primary-500" />
          AI 종합 분석
        </h2>

        <div class="space-y-5">
          <div>
            <p class="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">강점</p>
            <ul class="space-y-2">
              <li v-for="(item, i) in aiAnalysis.strengths" :key="i" class="flex items-start gap-2 text-sm text-gray-700">
                <span class="mt-0.5 text-green-500 text-base leading-none">✓</span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div>
            <p class="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">개선 권장</p>
            <ul class="space-y-2">
              <li v-for="(item, i) in aiAnalysis.improvements" :key="i" class="flex items-start gap-2 text-sm text-gray-700">
                <span class="mt-0.5 text-orange-400 text-base leading-none">→</span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="pt-4 border-t border-gray-100">
            <p class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">학부모님께</p>
            <p class="text-sm text-gray-700 leading-relaxed">{{ aiAnalysis.recommendation }}</p>
          </div>
        </div>
      </div>

      <!-- 상담 메모 -->
      <div v-if="consult.memo" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <UIcon name="i-lucide-message-square" class="w-4 h-4 text-gray-400" />
          상담 내용
        </h2>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ consult.memo }}</p>
      </div>

      <!-- 푸터 -->
      <div class="text-center text-xs text-gray-400 pt-4 pb-8">
        <p>본 리포트는 YBM AI Report 시스템에서 생성되었습니다.</p>
        <p class="mt-1">{{ new Date(consult.completedAt!).toLocaleString('ko-KR') }} 발행</p>
      </div>
    </div>
  </div>
</template>
