<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const id = Number(route.params.id)

const allRecords = [
  { id: 1,  academy: '강남학원', cohort: '3기', year: '2연차', applicant: '김민준', class: 'A반', teacher: '이지은', score: 85,  date: '2026.01.10' },
  { id: 2,  academy: '서초학원', cohort: '3기', year: '2연차', applicant: '박서연', class: 'B반', teacher: '최현우', score: 92,  date: '2026.01.11' },
  { id: 3,  academy: '송파학원', cohort: '3기', year: '2연차', applicant: '이도윤', class: 'A반', teacher: '이지은', score: 78,  date: '2026.01.12' },
  { id: 4,  academy: '강남학원', cohort: '3기', year: '2연차', applicant: '정수아', class: 'C반', teacher: '김태양', score: 88,  date: '2026.01.13' },
  { id: 5,  academy: '마포학원', cohort: '3기', year: '2연차', applicant: '최예린', class: 'B반', teacher: '최현우', score: 95,  date: '2026.01.14' },
  { id: 6,  academy: '용산학원', cohort: '3기', year: '2연차', applicant: '한지호', class: 'A반', teacher: '이지은', score: 72,  date: '2026.01.15' },
  { id: 7,  academy: '강남학원', cohort: '3기', year: '2연차', applicant: '오승현', class: 'C반', teacher: '김태양', score: 81,  date: '2026.01.16' },
  { id: 8,  academy: '서초학원', cohort: '3기', year: '2연차', applicant: '윤채원', class: 'B반', teacher: '최현우', score: 90,  date: '2026.01.17' },
  { id: 9,  academy: '송파학원', cohort: '3기', year: '2연차', applicant: '임준혁', class: 'A반', teacher: '이지은', score: 67,  date: '2026.01.18' },
  { id: 10, academy: '마포학원', cohort: '3기', year: '2연차', applicant: '신하은', class: 'C반', teacher: '김태양', score: 84,  date: '2026.01.19' },
]

const student = allRecords.find(r => r.id === id)
if (!student) {
  navigateTo('/reports/rsa', { replace: true })
}

const classAvgScore = Math.round(
  allRecords.filter(r => r.class === student?.class).reduce((s, r) => s + r.score, 0) /
  allRecords.filter(r => r.class === student?.class).length
)

// 파트별 점수 (샘플)
const partScores = [
  { label: 'Part 1 — 어휘 (Vocabulary)',      score: Math.round((student?.score ?? 0) * 0.22), max: 20, avg: 14 },
  { label: 'Part 2 — 문법 (Grammar)',          score: Math.round((student?.score ?? 0) * 0.24), max: 20, avg: 13 },
  { label: 'Part 3 — 독해 (Reading)',          score: Math.round((student?.score ?? 0) * 0.27), max: 25, avg: 17 },
  { label: 'Part 4 — 듣기 (Listening)',        score: Math.round((student?.score ?? 0) * 0.28), max: 25, avg: 16 },
  { label: 'Part 5 — 쓰기 (Writing)',          score: Math.round((student?.score ?? 0) * 0.10), max: 10, avg: 7  },
]

// 이전 기수 대비 (샘플)
const prevScore = Math.max(40, (student?.score ?? 0) - Math.floor(Math.random() * 12 + 3))

function scoreColor(score: number) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  return 'error'
}

function barColor(score: number, max: number) {
  const pct = score / max
  if (pct >= 0.9) return 'bg-green-500'
  if (pct >= 0.75) return 'bg-blue-400'
  if (pct >= 0.6) return 'bg-yellow-400'
  return 'bg-red-400'
}

// AI 종합 의견 (점수 기반 동적 생성)
const aiData = computed(() => {
  const s = student!
  const diff = s.score - classAvgScore
  const diffText = diff >= 0 ? `+${diff}점` : `${diff}점`
  const prevDiff = s.score - prevScore

  const strengths = partScores
    .filter(p => p.score / p.max >= 0.8)
    .map(p => `${p.label.split('—')[1].trim()} 영역에서 ${p.score}/${p.max}점으로 우수한 성과`)

  const improvements = partScores
    .filter(p => p.score / p.max < 0.7)
    .map(p => `${p.label.split('—')[1].trim()} 영역 집중 보완 필요 (${p.score}/${p.max}점)`)

  return {
    summary: `${s.applicant} 응시자는 이번 ${s.cohort} ${s.year} RSA 시험에서 총점 ${s.score}점을 기록했습니다. 반 평균(${classAvgScore}점) 대비 ${diffText}이며, 이전 기수 대비 ${prevDiff >= 0 ? `${prevDiff}점 향상` : `${Math.abs(prevDiff)}점 하락`}했습니다.`,
    strengths: strengths.length ? strengths : [`전반적으로 균형 잡힌 실력을 보임 (총점 ${s.score}점)`],
    improvements: improvements.length ? improvements : ['전 영역에서 고른 수준을 유지하고 있으며, 추가 심화 학습 권장'],
    nextSteps: [
      s.score >= 90 ? '심화 과정 진입 적합' : s.score >= 80 ? '현재 과정 유지 권장' : '기초 보강 집중 필요',
      '정기적인 모의고사로 약점 파악 지속',
      '담당 강사와의 1:1 피드백 세션 권장',
    ],
  }
})
</script>

<template>
  <div v-if="student" class="p-6 space-y-6 max-w-4xl mx-auto">

    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/reports/rsa" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI RSA Report</h2>
            <UBadge color="primary" variant="soft" icon="i-lucide-sparkles">AI 분석</UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ student.cohort }} {{ student.year }} — {{ student.academy }}
          </p>
        </div>
      </div>
      <UButton icon="i-lucide-printer" variant="outline" color="neutral">Print</UButton>
    </div>

    <!-- 기본 정보 -->
    <UCard>
      <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">응시자</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.applicant }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">강사</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.teacher }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">학원</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.academy }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">클래스</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.class }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">기수 / 연차</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.cohort }} / {{ student.year }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">시험 일시</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.date }}</span>
        </div>
      </div>
    </UCard>

    <!-- 점수 요약 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">점수 분석</h3>
      </template>
      <div class="grid grid-cols-2 gap-6">
        <!-- 점수 시각화 -->
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">내 점수</p>
              <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg class="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b82f6" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - student.score"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-base font-bold text-gray-900 dark:text-white">{{ student.score }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">/ 100점</p>
            </div>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">반 평균</p>
              <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg class="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#9ca3af" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - classAvgScore"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-base font-bold text-gray-900 dark:text-white">{{ classAvgScore }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">/ 100점</p>
            </div>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">이전 기수</p>
              <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg class="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#a78bfa" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - prevScore"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-base font-bold text-gray-900 dark:text-white">{{ prevScore }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">/ 100점</p>
            </div>
          </div>
          <!-- 등급 -->
          <div class="flex items-center justify-center gap-3">
            <UBadge :color="scoreColor(student.score)" variant="soft" size="lg">
              {{ student.score >= 90 ? 'A등급' : student.score >= 80 ? 'B등급' : student.score >= 70 ? 'C등급' : 'D등급' }}
            </UBadge>
            <span class="text-sm text-gray-500">
              반 평균 대비
              <strong :class="student.score >= classAvgScore ? 'text-blue-500' : 'text-red-400'">
                {{ student.score >= classAvgScore ? '+' : '' }}{{ student.score - classAvgScore }}점
              </strong>
            </span>
          </div>
        </div>
        <!-- AI 코멘트 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 분석 코멘트
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ aiData.summary }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- 파트별 점수 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">파트별 점수 분석</h3>
      </template>
      <div class="space-y-4">
        <div v-for="part in partScores" :key="part.label" class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300">{{ part.label }}</span>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-400">평균 {{ part.avg }}/{{ part.max }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ part.score }} / {{ part.max }}</span>
            </div>
          </div>
          <!-- 내 점수 바 -->
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all"
              :class="barColor(part.score, part.max)"
              :style="`width: ${(part.score / part.max) * 100}%`"
            />
          </div>
          <!-- 평균 점수 바 -->
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1">
            <div
              class="h-1 rounded-full bg-gray-400 opacity-50"
              :style="`width: ${(part.avg / part.max) * 100}%`"
            />
          </div>
          <div class="flex gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400 inline-block" /> 내 점수</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-gray-400 inline-block" /> 반 평균</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- AI 종합 의견 -->
    <UCard class="border-primary-200 dark:border-primary-800">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">AI 종합 의견</h3>
        </div>
      </template>
      <div class="space-y-5">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ aiData.summary }}</p>

        <div class="grid grid-cols-2 gap-4">
          <!-- 강점 -->
          <div class="rounded-lg bg-green-50 dark:bg-green-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-thumbs-up" class="w-4 h-4 text-green-600" />
              <span class="text-sm font-semibold text-green-700 dark:text-green-400">강점 영역</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(s, i) in aiData.strengths" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {{ s }}
              </li>
            </ul>
          </div>
          <!-- 개선점 -->
          <div class="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-target" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">보완 필요 영역</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(s, i) in aiData.improvements" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                {{ s }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 향후 학습 방향 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-route" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">향후 학습 방향</h3>
        </div>
      </template>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="(step, i) in aiData.nextSteps"
          :key="i"
          color="primary"
          variant="soft"
          size="lg"
        >
          {{ step }}
        </UBadge>
      </div>
    </UCard>

  </div>
</template>
