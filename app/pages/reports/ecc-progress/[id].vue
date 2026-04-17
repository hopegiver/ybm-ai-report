<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const id = Number(route.params.id)

const allRecords = [
  { id: 1,  name: '김*린', nickname: 'Aileen',  dob: '1908**', curriculum: 'Ivy Master', day: '월화수목금(MTWThF)', level: 'CA 3B', teachers: 'K. Renee, K. Ellie', period: '2026.04.13 ~ 2026.05.29' },
  { id: 2,  name: '박*연', nickname: 'Ella',    dob: '1905**', curriculum: 'Ivy Master', day: '월화수목금(MTWThF)', level: 'PG 6B', teachers: 'K. Renee, K. Ellie', period: '2026.04.13 ~ 2026.05.29' },
  { id: 3,  name: '이*윤', nickname: 'Peter',   dob: '1908**', curriculum: 'Ivy Master', day: '월화수목금(MTWThF)', level: 'PG 5B', teachers: 'K. James',           period: '2026.04.13 ~ 2026.05.29' },
  { id: 4,  name: '이*이', nickname: '',        dob: '1906**', curriculum: 'Ivy Master', day: '월화수목금(MTWThF)', level: 'CA 3B', teachers: 'K. Renee, K. Ellie', period: '2026.04.13 ~ 2026.05.29' },
  { id: 5,  name: '정*우', nickname: 'Bella',   dob: '1908**', curriculum: 'Elementary (초등회화반)', day: '월수금(MWF)', level: 'PG 4A', teachers: 'K. Amy',   period: '2026.04.13 ~ 2026.05.29' },
  { id: 6,  name: '정*원', nickname: 'Jenny',   dob: '1906**', curriculum: 'Elementary (초등회화반)', day: '월수금(MWF)', level: 'PG 4A', teachers: 'K. Amy',   period: '2026.04.13 ~ 2026.05.29' },
  { id: 7,  name: '허*우', nickname: 'Lucas.H', dob: '1912**', curriculum: 'ONE TO ONE',  day: '화목(TTh)', level: 'CA 2A', teachers: 'K. Sarah',               period: '2026.04.13 ~ 2026.05.29' },
  { id: 8,  name: '허*빈', nickname: 'Belle',   dob: '1912**', curriculum: 'ONE TO ONE',  day: '화목(TTh)', level: 'CA 2A', teachers: 'K. Sarah',               period: '2026.04.13 ~ 2026.05.29' },
  { id: 9,  name: '강*준', nickname: 'Ethan',   dob: '1910**', curriculum: '단과',         day: '화목(TTh)', level: 'PG 3B', teachers: 'K. Mike',                period: '2026.04.13 ~ 2026.05.29' },
  { id: 10, name: '윤*서', nickname: 'Sophia',  dob: '1911**', curriculum: '방학특강',      day: '월화수목금(MTWThF)', level: 'CA 1A', teachers: 'K. Jane',       period: '2026.04.13 ~ 2026.05.29' },
]

const student = allRecords.find(r => r.id === id)
if (!student) {
  navigateTo('/reports/ecc-progress', { replace: true })
}

// 샘플 분석 데이터 (실제 연동 시 API로 대체)
const analysisData = {
  attendance: { rate: 92, classAvg: 85, present: 23, absent: 2, late: 0, total: 25 },
  achievement: {
    myScore: 78,
    classAvg: 71,
    listening: 82,
    reading: 74,
  },
  evaluation: {
    language: [
      { label: 'Listening (듣기)',         my: 5, prev: 4 },
      { label: 'Reading (읽기)',           my: 4, prev: 3 },
      { label: 'Writing (쓰기)',           my: 4, prev: 4 },
      { label: 'Speaking (말하기)',        my: 5, prev: 4 },
      { label: 'Structure & Grammar (문법)', my: 3, prev: 3 },
      { label: 'Vocabulary (어휘)',        my: 5, prev: 4 },
      { label: 'Fluency (유창함)',         my: 4, prev: 3 },
      { label: 'Proper Usage (활용능력)',  my: 5, prev: 4 },
    ],
    behavior: [
      { label: 'Manner (품행)',            my: 5, prev: 5 },
      { label: 'Attention (집중도)',       my: 4, prev: 3 },
      { label: 'Participation (참여도)',   my: 5, prev: 4 },
      { label: 'Self-confidence (자신감)', my: 3, prev: 3 },
      { label: 'Homework (과제 수행)',     my: 5, prev: 4 },
    ],
  },
  ai: {
    summary: `${student?.nickname || student?.name} 학생은 이번 기수 전반적으로 우수한 학습 성과를 보였습니다. 출석률 92%로 반 평균(85%)을 상회하며 꾸준한 학습 태도를 유지했습니다. 시험 점수는 반 평균 대비 7점 높은 78점을 기록했으며, 특히 Listening(82점)에서 강점을 보였습니다.`,
    strengths: [
      'Listening과 Speaking 영역에서 반 평균 대비 높은 수행도를 보임',
      '수업 참여도와 품행이 매우 우수하여 학습 분위기 형성에 기여',
      '어휘력(Vocabulary)이 이전 기수 대비 눈에 띄게 향상됨',
    ],
    improvements: [
      'Grammar 영역이 상대적으로 낮으므로 집중 보완 필요',
      'Reading 속도 향상을 위한 추가 연습 권장',
      '자신감(Self-confidence) 향상을 위한 발표 기회 확대 필요',
    ],
    nextLevel: {
      recommendation: student?.level?.includes('CA') ? student.level.replace('CA', 'PG') : (student?.level || '') + ' (다음 단계)',
      reason: '현재 레벨 목표 기준을 충족하였으며, 특히 구어 능력이 다음 단계 진입에 적합한 수준에 도달했습니다.',
      focus: ['Grammar 집중 보강', 'Academic Reading 확장', '발표·토론 중심 활동 강화'],
    },
  },
}

const evalLabels = ['N/A', 'Failed', 'Needs\nImprovement', 'Satisfactory', 'Very Good', 'Excellent']
const evalColors: Record<number, string> = {
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-blue-400',
  5: 'bg-green-500',
}

function evalLabel(score: number) {
  return evalLabels[score] ?? ''
}
function evalColor(score: number) {
  return evalColors[score] ?? 'bg-gray-300'
}
</script>

<template>
  <div v-if="student" class="p-6 space-y-6 max-w-4xl mx-auto">

    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" :to="'/reports/ecc-progress'" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI Student Progress Report</h2>
            <UBadge color="primary" variant="soft" icon="i-lucide-sparkles">AI 분석</UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">ECC Progress — {{ student.curriculum }}</p>
        </div>
      </div>
      <UButton icon="i-lucide-printer" variant="outline" color="neutral">Print</UButton>
    </div>

    <!-- 학생 기본 정보 -->
    <UCard>
      <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">Name</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.name }} ({{ student.nickname }})</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">Teachers</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.teachers }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">Level</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.level }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-20 flex-shrink-0">Period</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.period }} · {{ student.day }}</span>
        </div>
      </div>
    </UCard>

    <!-- 출결 분석 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">출결 분석</h3>
      </template>
      <div class="grid grid-cols-2 gap-6">
        <!-- 수치 요약 -->
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="rounded-lg bg-green-50 dark:bg-green-950 p-3">
              <p class="text-2xl font-bold text-green-600">{{ analysisData.attendance.present }}</p>
              <p class="text-xs text-gray-500 mt-1">출석</p>
            </div>
            <div class="rounded-lg bg-red-50 dark:bg-red-950 p-3">
              <p class="text-2xl font-bold text-red-500">{{ analysisData.attendance.absent }}</p>
              <p class="text-xs text-gray-500 mt-1">결석</p>
            </div>
            <div class="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-3">
              <p class="text-2xl font-bold text-yellow-500">{{ analysisData.attendance.late }}</p>
              <p class="text-xs text-gray-500 mt-1">지각</p>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">출석률</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ analysisData.attendance.rate }}%</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                class="bg-primary-500 h-2 rounded-full"
                :style="`width: ${analysisData.attendance.rate}%`"
              />
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>반 평균 {{ analysisData.attendance.classAvg }}%</span>
              <span class="text-primary-500 font-medium">+{{ analysisData.attendance.rate - analysisData.attendance.classAvg }}%p</span>
            </div>
          </div>
        </div>
        <!-- AI 코멘트 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 분석 코멘트
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            전체 {{ analysisData.attendance.total }}일 중 {{ analysisData.attendance.present }}일 출석하여
            출석률 <strong>{{ analysisData.attendance.rate }}%</strong>를 기록했습니다.
            반 평균({{ analysisData.attendance.classAvg }}%) 대비 <strong class="text-primary-600">+{{ analysisData.attendance.rate - analysisData.attendance.classAvg }}%p</strong> 높은 수준으로,
            매우 성실한 학습 태도를 보여주고 있습니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- 성취도 분석 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Achievement Test 분석</h3>
      </template>
      <div class="grid grid-cols-2 gap-6">
        <!-- 점수 시각화 -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">My Score</p>
              <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b82f6" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - analysisData.achievement.myScore"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-lg font-bold text-gray-900 dark:text-white">{{ analysisData.achievement.myScore }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-2">/ 100점</p>
            </div>
            <div class="text-center rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">Class Avg</p>
              <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#9ca3af" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - analysisData.achievement.classAvg"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-lg font-bold text-gray-900 dark:text-white">{{ analysisData.achievement.classAvg }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-2">/ 100점</p>
            </div>
          </div>
          <div class="space-y-2">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">Avg Listening Score</span>
                <span class="font-medium">{{ analysisData.achievement.listening }}%</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <div class="bg-blue-400 h-1.5 rounded-full" :style="`width: ${analysisData.achievement.listening}%`" />
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">Avg Reading Score</span>
                <span class="font-medium">{{ analysisData.achievement.reading }}%</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <div class="bg-green-400 h-1.5 rounded-full" :style="`width: ${analysisData.achievement.reading}%`" />
              </div>
            </div>
          </div>
        </div>
        <!-- AI 코멘트 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 분석 코멘트
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            시험 점수 <strong>{{ analysisData.achievement.myScore }}점</strong>으로 반 평균({{ analysisData.achievement.classAvg }}점) 대비
            <strong class="text-primary-600">+{{ analysisData.achievement.myScore - analysisData.achievement.classAvg }}점</strong> 높은 성과를 달성했습니다.
            Listening({{ analysisData.achievement.listening }}%)이 Reading({{ analysisData.achievement.reading }}%)보다 높아
            청해 능력이 독해보다 강점임을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Evaluation 분석 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Evaluation 분석</h3>
      </template>
      <div class="space-y-6">
        <!-- Language -->
        <div>
          <h4 class="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Language (언어)</h4>
          <div class="space-y-2">
            <div v-for="item in analysisData.evaluation.language" :key="item.label" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 dark:text-gray-400 w-44 flex-shrink-0">{{ item.label }}</span>
              <div class="flex gap-1.5">
                <div
                  v-for="n in 5" :key="n"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                  :class="n === item.my
                    ? `${evalColor(n)} text-white ring-2 ring-offset-1 ring-current`
                    : n <= item.my
                      ? `${evalColor(n)} text-white opacity-80`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'"
                >
                  {{ n }}
                </div>
              </div>
              <div class="flex items-center gap-1 ml-2">
                <UIcon
                  :name="item.my > item.prev ? 'i-lucide-trending-up' : item.my < item.prev ? 'i-lucide-trending-down' : 'i-lucide-minus'"
                  class="w-4 h-4"
                  :class="item.my > item.prev ? 'text-green-500' : item.my < item.prev ? 'text-red-400' : 'text-gray-400'"
                />
                <span class="text-xs text-gray-400">이전 기수 {{ item.prev }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Behavior -->
        <div>
          <h4 class="text-sm font-semibold text-orange-500 mb-3">Behavior (태도)</h4>
          <div class="space-y-2">
            <div v-for="item in analysisData.evaluation.behavior" :key="item.label" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 dark:text-gray-400 w-44 flex-shrink-0">{{ item.label }}</span>
              <div class="flex gap-1.5">
                <div
                  v-for="n in 5" :key="n"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                  :class="n === item.my
                    ? `${evalColor(n)} text-white ring-2 ring-offset-1 ring-current`
                    : n <= item.my
                      ? `${evalColor(n)} text-white opacity-80`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'"
                >
                  {{ n }}
                </div>
              </div>
              <div class="flex items-center gap-1 ml-2">
                <UIcon
                  :name="item.my > item.prev ? 'i-lucide-trending-up' : item.my < item.prev ? 'i-lucide-trending-down' : 'i-lucide-minus'"
                  class="w-4 h-4"
                  :class="item.my > item.prev ? 'text-green-500' : item.my < item.prev ? 'text-red-400' : 'text-gray-400'"
                />
                <span class="text-xs text-gray-400">이전 기수 {{ item.prev }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 범례 -->
        <div class="flex gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span v-for="(label, i) in ['Failed', 'Needs Improvement', 'Satisfactory', 'Very Good', 'Excellent']" :key="i" class="flex items-center gap-1">
            <span class="w-4 h-4 rounded-full inline-block" :class="evalColor(i + 1)" />
            {{ i + 1 }}. {{ label }}
          </span>
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
        <!-- 총평 -->
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ analysisData.ai.summary }}
        </p>

        <div class="grid grid-cols-2 gap-4">
          <!-- 강점 -->
          <div class="rounded-lg bg-green-50 dark:bg-green-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-thumbs-up" class="w-4 h-4 text-green-600" />
              <span class="text-sm font-semibold text-green-700 dark:text-green-400">이번 기수 강점</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="(s, i) in analysisData.ai.strengths" :key="i"
                class="flex gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span class="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {{ s }}
              </li>
            </ul>
          </div>
          <!-- 개선점 -->
          <div class="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-target" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">개선 필요 영역</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="(s, i) in analysisData.ai.improvements" :key="i"
                class="flex gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
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
      <div class="space-y-4">
        <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <UIcon name="i-lucide-arrow-up-circle" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              추천 다음 레벨: <span class="text-primary-600 dark:text-primary-400">{{ analysisData.ai.nextLevel.recommendation }}</span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ analysisData.ai.nextLevel.reason }}</p>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">다음 기수 집중 학습 목표</p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(focus, i) in analysisData.ai.nextLevel.focus" :key="i"
              color="primary"
              variant="soft"
              size="lg"
            >
              {{ focus }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

  </div>
</template>
