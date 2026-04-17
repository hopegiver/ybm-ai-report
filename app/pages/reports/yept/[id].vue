<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const id = Number(route.params.id)

const allRecords = [
  { id: 1,  academy: '모비리드 강남점', applicant: '김*린', school: '도곡초등학교',  level: 'Level 3', datetime: '2026.04.05 10:00', status: '완료', assignedLevel: 'CA 3B' },
  { id: 2,  academy: '모비리드 강남점', applicant: '박*연', school: '개포초등학교',  level: 'Level 5', datetime: '2026.04.05 10:30', status: '완료', assignedLevel: 'PG 6B' },
  { id: 3,  academy: '모비리드 서초점', applicant: '이*윤', school: '서초초등학교',  level: 'Level 4', datetime: '2026.04.06 11:00', status: '완료', assignedLevel: 'PG 5B' },
  { id: 4,  academy: '모비리드 서초점', applicant: '이*이', school: '반포유치원',    level: 'Level 3', datetime: '2026.04.06 11:30', status: '완료', assignedLevel: 'CA 3B' },
  { id: 5,  academy: '모비리드 송파점', applicant: '정*원', school: '문정초등학교',  level: 'Level 2', datetime: '2026.04.07 14:30', status: '완료', assignedLevel: 'PG 4A' },
  { id: 6,  academy: '모비리드 강동점', applicant: '허*우', school: '강동초등학교',  level: 'Level 1', datetime: '2026.04.08 10:00', status: '완료', assignedLevel: 'CA 2A' },
  { id: 7,  academy: '모비리드 마포점', applicant: '강*준', school: '마포초등학교',  level: 'Level 3', datetime: '2026.04.09 13:00', status: '완료', assignedLevel: 'PG 3B' },
]

const record = allRecords.find(r => r.id === id)
if (!record) {
  navigateTo('/reports/yept', { replace: true })
}

// 섹션별 점수 데이터
const sectionScores = computed(() => [
  { label: 'Listening Comprehension', score: 82, maxScore: 100, classAvg: 74 },
  { label: 'Reading Comprehension',   score: 76, maxScore: 100, classAvg: 70 },
  { label: 'Vocabulary & Grammar',    score: 68, maxScore: 100, classAvg: 65 },
  { label: 'Writing Expression',      score: 72, maxScore: 100, classAvg: 66 },
])

const totalScore = computed(() => Math.round(sectionScores.value.reduce((s, c) => s + c.score, 0) / sectionScores.value.length))
const totalClassAvg = computed(() => Math.round(sectionScores.value.reduce((s, c) => s + c.classAvg, 0) / sectionScores.value.length))

// 평가 항목 데이터
const evaluationItems = computed(() => [
  { label: 'Phonics & Pronunciation', my: 4, prev: 3 },
  { label: 'Listening (듣기)',         my: 5, prev: 4 },
  { label: 'Reading (읽기)',           my: 4, prev: 3 },
  { label: 'Vocabulary (어휘)',        my: 4, prev: 3 },
  { label: 'Grammar (문법)',           my: 3, prev: 3 },
  { label: 'Writing (쓰기)',           my: 3, prev: 2 },
])

// AI 분석 데이터
const aiData = computed(() => ({
  summary: `${record?.applicant} 학생은 YEPT ${record?.level} 응시 결과 전반적으로 우수한 영어 능력을 보여주었습니다. 총점 ${totalScore.value}점으로 응시자 평균(${totalClassAvg.value}점) 대비 높은 성과를 기록하였으며, 특히 Listening Comprehension 영역에서 두드러진 강점을 보였습니다. 배정 레벨 ${record?.assignedLevel}은 현재 학생의 실력에 적합한 수준으로 판단됩니다.`,
  strengths: [
    'Listening Comprehension에서 82점으로 응시자 평균 대비 +8점 상회',
    'Reading 영역에서 일관된 독해 능력과 어휘 이해도를 보임',
    'Writing Expression에서 또래 대비 논리적 표현 능력이 우수',
  ],
  improvements: [
    'Grammar 영역이 상대적으로 낮으므로 집중 학습 필요',
    'Vocabulary 범위를 확장하여 Reading 점수 추가 향상 가능',
    'Writing에서 문장 구조의 다양성 확보 권장',
  ],
  levelReason: `YEPT ${record?.level} 수준의 문항에서 Listening·Reading 영역의 정답률이 높아 ${record?.assignedLevel} 배정이 적절합니다. Grammar·Writing 보완 시 한 단계 상위 레벨 진입도 충분히 기대할 수 있습니다.`,
  nextFocus: ['Grammar 집중 학습', 'Academic Vocabulary 확장', 'Writing 구조화 연습', 'Reading 속도 향상'],
}))

const evalColors: Record<number, string> = {
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-blue-400',
  5: 'bg-green-500',
}
function evalColor(score: number) {
  return evalColors[score] ?? 'bg-gray-300'
}

function scoreBarColor(score: number) {
  if (score >= 80) return 'bg-green-500'
  if (score >= 70) return 'bg-blue-400'
  if (score >= 60) return 'bg-yellow-400'
  return 'bg-red-400'
}
</script>

<template>
  <div v-if="record" class="p-6 space-y-6 max-w-4xl mx-auto">

    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" :to="'/reports/yept'" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI YEPT 분석 리포트</h2>
            <UBadge color="primary" variant="soft" icon="i-lucide-sparkles">AI 분석</UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">YEPT — {{ record.level }}</p>
        </div>
      </div>
      <UButton icon="i-lucide-printer" variant="outline" color="neutral">Print</UButton>
    </div>

    <!-- 응시자 기본 정보 -->
    <UCard>
      <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">응시자</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ record.applicant }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">학교(유치원)</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ record.school }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">응시 학원</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ record.academy }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">응시 일시</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ record.datetime }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">응시 레벨</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ record.level }}</span>
        </div>
        <div class="flex gap-3">
          <span class="text-gray-500 w-24 flex-shrink-0">배정 레벨</span>
          <span class="font-semibold text-primary-600 dark:text-primary-400">{{ record.assignedLevel }}</span>
        </div>
      </div>
    </UCard>

    <!-- 섹션별 점수 분석 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">섹션별 점수 분석</h3>
      </template>
      <div class="grid grid-cols-2 gap-6">
        <!-- 점수 바 차트 -->
        <div class="space-y-4">
          <div v-for="item in sectionScores" :key="item.label" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ item.label }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ item.score }}점</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="scoreBarColor(item.score)"
                :style="`width: ${item.score}%`"
              />
            </div>
            <div class="text-xs text-gray-400">응시자 평균 {{ item.classAvg }}점</div>
          </div>
        </div>
        <!-- 종합 점수 + AI 코멘트 -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">종합 점수</p>
              <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b82f6" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - totalScore"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-lg font-bold text-gray-900 dark:text-white">{{ totalScore }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-2">/ 100점</p>
            </div>
            <div class="text-center rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p class="text-xs text-gray-500 mb-2">응시자 평균</p>
              <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#9ca3af" stroke-width="3"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - totalClassAvg"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="absolute text-lg font-bold text-gray-900 dark:text-white">{{ totalClassAvg }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-2">/ 100점</p>
            </div>
          </div>
          <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
            <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
              <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
              AI 분석 코멘트
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              종합 점수 <strong>{{ totalScore }}점</strong>으로 응시자 평균({{ totalClassAvg }}점) 대비
              <strong class="text-primary-600">+{{ totalScore - totalClassAvg }}점</strong> 높은 성과입니다.
              Listening 영역이 가장 강점이며, Grammar·Writing 영역의 집중 보완이 권장됩니다.
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 영역별 평가 -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">영역별 역량 평가</h3>
      </template>
      <div class="space-y-3">
        <div v-for="item in evaluationItems" :key="item.label" class="flex items-center gap-3">
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
            <span class="text-xs text-gray-400">이전 {{ item.prev }}</span>
          </div>
        </div>
        <!-- 범례 -->
        <div class="flex gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
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
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ aiData.summary }}
        </p>
        <div class="grid grid-cols-2 gap-4">
          <!-- 강점 -->
          <div class="rounded-lg bg-green-50 dark:bg-green-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-thumbs-up" class="w-4 h-4 text-green-600" />
              <span class="text-sm font-semibold text-green-700 dark:text-green-400">강점</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="(s, i) in aiData.strengths" :key="i"
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
                v-for="(s, i) in aiData.improvements" :key="i"
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

    <!-- 레벨 배정 근거 및 향후 학습 방향 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-route" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">레벨 배정 근거 및 향후 학습 방향</h3>
        </div>
      </template>
      <div class="space-y-4">
        <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <UIcon name="i-lucide-award" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              배정 레벨: <span class="text-primary-600 dark:text-primary-400">{{ record.assignedLevel }}</span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ aiData.levelReason }}</p>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">권장 학습 집중 영역</p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(focus, i) in aiData.nextFocus" :key="i"
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
