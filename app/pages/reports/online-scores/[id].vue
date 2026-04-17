<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const id = Number(route.params.id)

const allStudents = [
  { id: 1, name: '김*린', nickname: 'Aileen',  curriculum: 'Ivy Master',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 2, name: '박*연', nickname: 'Ella',    curriculum: 'Ivy Master',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 3, name: '이*윤', nickname: 'Peter',   curriculum: 'Ivy Master',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 4, name: '이*이', nickname: '',        curriculum: 'Ivy Master',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 5, name: '정*우', nickname: 'Bella',   curriculum: 'Elementary (초등회화반)', level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 6, name: '정*원', nickname: 'Jenny',   curriculum: 'Elementary (초등회화반)', level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 7, name: '허*우', nickname: 'Lucas.H', curriculum: 'ONE TO ONE',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
  { id: 8, name: '허*빈', nickname: 'Belle',   curriculum: 'ONE TO ONE',              level: 'English Carnival 3B', period: '2026.04.14 ~ 2026.05.29', campus: '강동' },
]

const student = allStudents.find(r => r.id === id)
if (!student) {
  navigateTo('/reports/online-scores', { replace: true })
}

const name = student?.nickname || student?.name || ''

// ── 샘플 데이터 ─────────────────────────────────────────────────────────────
const avg = {
  total:     { my: 0,  myEcc: 88, allEcc: 78 },
  listening: { my: 0,  myEcc: 94, allEcc: 89 },
  reading:   { my: 0,  myEcc: 88, allEcc: 80 },
  writing:   { my: 0,  myEcc: 82, allEcc: 62 },
}

const dailyLRW = Array.from({ length: 12 }, (_, i) => ({
  day: `Day${i + 1}`,
  myScore: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i],
  myEcc:   [82, 85, 80, 88, 84, 87, 83, 86, 85, 88, 84, 87][i],
  allEcc:  [76, 78, 74, 80, 77, 79, 75, 80, 78, 82, 79, 81][i],
}))

const speakingDays = Array.from({ length: 10 }, (_, i) => ({
  day: `Day${i + 1}`,
  completed: false,
}))

const achievement = {
  my: 0, myEcc: 86, allEcc: 76,
}

const concentration = Array.from({ length: 12 }, (_, i) => ({
  day: `Day${i + 1}`,
  score: 0,
}))

const progressTrend = Array.from({ length: 6 }, (_, i) => ({
  week: `W${i + 1}`,
  myScore: 0,
  myEcc:   [80, 82, 83, 85, 86, 88][i],
  allEcc:  [74, 75, 76, 77, 78, 80][i],
}))

// ── AI 분석 데이터 ────────────────────────────────────────────────────────────
const ai = {
  summary: `${name} 학생은 이번 기수 Daily Home Study 데이터가 아직 충분히 누적되지 않은 상태입니다. 반 평균(My ECC) 및 전체 평균(All ECC)과 비교했을 때 학습 참여 기회가 남아 있으며, 지금부터 꾸준히 학습을 이어간다면 충분히 목표 수준에 도달할 수 있습니다.`,

  dataInsights: [
    {
      icon: 'i-lucide-bar-chart-2',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950',
      title: 'Daily LRW 평균 추이',
      content: '반 평균(My ECC)은 Day1~12 전반에 걸쳐 80~88점대를 유지하며 안정적입니다. 전체 평균(All ECC)은 74~82점대로, 본 반의 학습 수준이 전체 대비 높은 편입니다.',
    },
    {
      icon: 'i-lucide-zap',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950',
      title: 'Achievement Test 해석',
      content: `반 평균 86점, 전체 평균 76점으로 10점 차의 격차가 발생하고 있습니다. 이는 본 반 학생들의 학습 집중도가 높다는 것을 의미하며, ${name} 학생도 정기 테스트 대비 학습을 병행한다면 충분히 반 평균 수준에 도달할 수 있습니다.`,
    },
    {
      icon: 'i-lucide-brain',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950',
      title: 'Concentration Level 의미',
      content: '집중도 점수는 학습 세션 내 활동 완료율과 응답 속도를 복합 반영합니다. 현재 데이터 미입력 상태이며, 꾸준한 학습 참여를 통해 집중도 데이터가 쌓이면 학습 패턴 분석이 가능해집니다.',
    },
  ],

  strengths: [
    '반 평균(My ECC)이 전체 평균(All ECC) 대비 전 영역에서 8~12점 높아 학급 전체의 학습 환경이 우수함',
    'Speaking 수업 구조가 Day1~10으로 체계적으로 구성되어 구어 능력 향상에 유리한 환경',
    'Logical Speaking(W1~W4) 과정을 통해 논리적 표현력을 단계적으로 발전시킬 수 있는 커리큘럼',
  ],

  improvements: [
    `Daily Home Study 미완료 항목이 있습니다. D1~D12 꾸준한 학습이 iSeed 누적과 직결됩니다`,
    'Speaking 완료율 향상 필요 — 구어 능력은 반복 노출과 실제 발화 연습이 핵심입니다',
    'Achievement Test 사전 복습: 시험 전날 해당 Day의 Listening·Reading 내용을 재확인하세요',
  ],

  learningGuide: [
    {
      phase: '단기 (이번 기수 남은 기간)',
      icon: 'i-lucide-calendar-check',
      color: 'border-blue-400',
      titleColor: 'text-blue-600 dark:text-blue-400',
      items: [
        'Daily Home Study D1~D12 누락 없이 완료 — 매일 15~20분 학습 루틴 확립',
        'Speaking Day 완료율 100% 목표 — 녹음 후 자신의 발음 피드백 확인',
        'Achievement Test 전 해당 Unit 어휘·문법 포인트 10분 복습',
      ],
    },
    {
      phase: '중기 (다음 기수)',
      icon: 'i-lucide-trending-up',
      color: 'border-green-400',
      titleColor: 'text-green-600 dark:text-green-400',
      items: [
        'Listening 점수 반 평균(94점) 근접 목표 — 매일 shadowing 10분 추가',
        'Writing 영역 집중 강화 — 반 평균(82점) 대비 격차 해소를 위한 문장 쓰기 연습',
        'Logical Speaking W1~W4 완주 후 자기 의견 정리 습관 형성',
      ],
    },
    {
      phase: '장기 (레벨업 이후)',
      icon: 'i-lucide-rocket',
      color: 'border-purple-400',
      titleColor: 'text-purple-600 dark:text-purple-400',
      items: [
        '다음 레벨 진입 시 Academic Reading 비중 증가에 대비한 독해 속도 향상',
        'JET(Junior English Test) 대비 문법·어휘 체계 정리',
        '토론·발표 중심 활동 참여 확대로 실용 영어 구사력 강화',
      ],
    },
  ],

  nextLevel: {
    recommendation: 'English Carnival 4A',
    condition: '현재 기수 Daily 평균 80점 이상, Achievement Test 반 평균 이상 달성 시 권장',
    focus: ['Daily 완료율 90% 이상', 'Speaking 완주', 'Writing 점수 향상', 'Achievement 반 평균 도달'],
  },
}

// ── 바 차트 헬퍼 ─────────────────────────────────────────────────────────────
const barSections = [
  { key: 'total',     label: 'Total Score' },
  { key: 'listening', label: 'Listening' },
  { key: 'reading',   label: 'Reading' },
  { key: 'writing',   label: 'Writing' },
] as const

function barHeight(val: number, max = 100) {
  return `${(val / max) * 100}%`
}
</script>

<template>
  <div v-if="student" class="p-6 space-y-6 max-w-4xl mx-auto">

    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/reports/online-scores" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI Report</h2>
            <UBadge color="primary" variant="soft" icon="i-lucide-sparkles">AI 분석</UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Online Scores — iLearning</p>
        </div>
      </div>
      <UButton icon="i-lucide-printer" variant="outline" color="neutral">Print</UButton>
    </div>

    <!-- 학생 기본 정보 -->
    <UCard>
      <div class="flex flex-wrap gap-x-10 gap-y-2 text-sm">
        <div class="flex gap-2">
          <span class="text-gray-500">Name</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.name }} ({{ student.nickname }})</span>
        </div>
        <div class="flex gap-2">
          <span class="text-gray-500">Campus</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.campus }}</span>
        </div>
        <div class="flex gap-2">
          <span class="text-gray-500">Level</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ student.level }} ({{ student.period }})</span>
        </div>
      </div>
    </UCard>

    <!-- Average Score -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">Average Score</h3>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> My Score</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block"></span> My ECC</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> All ECC</span>
          </div>
        </div>
      </template>
      <div class="space-y-5">
        <!-- 바 차트 (CSS) -->
        <div class="flex gap-6">
          <!-- Total -->
          <div class="flex-shrink-0 w-40">
            <div class="flex items-end gap-2 h-28">
              <div class="flex flex-col items-center gap-1 flex-1">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg.total.my }}</span>
                <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                  <div class="absolute bottom-0 w-full rounded-t bg-rose-400 transition-all" :style="`height: ${barHeight(avg.total.my)}`"></div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1 flex-1">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg.total.myEcc }}</span>
                <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                  <div class="absolute bottom-0 w-full rounded-t bg-gray-500 transition-all" :style="`height: ${barHeight(avg.total.myEcc)}`"></div>
                </div>
              </div>
              <div class="flex flex-col items-center gap-1 flex-1">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg.total.allEcc }}</span>
                <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                  <div class="absolute bottom-0 w-full rounded-t bg-amber-400 transition-all" :style="`height: ${barHeight(avg.total.allEcc)}`"></div>
                </div>
              </div>
            </div>
            <p class="text-xs text-center text-gray-500 mt-2">Total Score</p>
          </div>

          <!-- 구분선 -->
          <div class="w-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- Listening / Reading / Writing -->
          <div class="flex gap-8 flex-1">
            <div v-for="section in (['listening', 'reading', 'writing'] as const)" :key="section" class="flex-1">
              <div class="flex items-end gap-1 h-28">
                <div class="flex flex-col items-center gap-1 flex-1">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg[section].my }}</span>
                  <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                    <div class="absolute bottom-0 w-full rounded-t bg-rose-400 transition-all" :style="`height: ${barHeight(avg[section].my)}`"></div>
                  </div>
                </div>
                <div class="flex flex-col items-center gap-1 flex-1">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg[section].myEcc }}</span>
                  <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                    <div class="absolute bottom-0 w-full rounded-t bg-gray-500 transition-all" :style="`height: ${barHeight(avg[section].myEcc)}`"></div>
                  </div>
                </div>
                <div class="flex flex-col items-center gap-1 flex-1">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ avg[section].allEcc }}</span>
                  <div class="w-full rounded-t relative bg-gray-100 dark:bg-gray-800" style="height: 96px;">
                    <div class="absolute bottom-0 w-full rounded-t bg-amber-400 transition-all" :style="`height: ${barHeight(avg[section].allEcc)}`"></div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-center text-gray-500 mt-2 capitalize">{{ section }}</p>
            </div>
          </div>
        </div>

        <!-- AI 데이터 해석 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 데이터 해석
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            반 평균(My ECC) 기준 Total <strong>88점</strong>으로 전체 평균(All ECC) 78점 대비 <strong class="text-primary-600">+10점</strong> 높습니다.
            영역별로는 Listening(94점)이 가장 높고, Writing(82점)이 상대적으로 낮아
            <strong>듣기 강점 / 쓰기 보완</strong>의 학습 패턴이 나타납니다.
            My Score가 0인 상태로, 학습 데이터 입력 후 반 평균과의 갭을 확인하고 목표 점수를 설정하세요.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Daily Study -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Daily Study</h3>
      </template>
      <div class="space-y-6">

        <!-- LRW 라인 차트 (SVG) -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Listening, Reading, Writing</h4>
          <div class="overflow-x-auto">
            <svg width="640" height="120" viewBox="0 0 640 120" class="w-full">
              <!-- Y축 눈금선 -->
              <line v-for="y in [20, 40, 60, 80, 100]" :key="y"
                x1="30" :y1="110 - y" x2="630" :y2="110 - y"
                stroke="#e5e7eb" stroke-width="0.5" />
              <text v-for="y in [0, 20, 40, 60, 80, 100]" :key="`l${y}`"
                x="24" :y="113 - y" text-anchor="end" font-size="8" fill="#9ca3af">{{ y }}</text>

              <!-- My ECC 라인 (gray) -->
              <polyline
                :points="dailyLRW.map((d, i) => `${30 + i * 50},${110 - d.myEcc}`).join(' ')"
                fill="none" stroke="#6b7280" stroke-width="1.5" />
              <circle v-for="(d, i) in dailyLRW" :key="`me${i}`"
                :cx="30 + i * 50" :cy="110 - d.myEcc" r="3" fill="#6b7280" />

              <!-- All ECC 라인 (amber) -->
              <polyline
                :points="dailyLRW.map((d, i) => `${30 + i * 50},${110 - d.allEcc}`).join(' ')"
                fill="none" stroke="#f59e0b" stroke-width="1.5" />
              <circle v-for="(d, i) in dailyLRW" :key="`ae${i}`"
                :cx="30 + i * 50" :cy="110 - d.allEcc" r="3" fill="#f59e0b" />

              <!-- My Score 라인 (rose) — 0점 -->
              <polyline
                :points="dailyLRW.map((d, i) => `${30 + i * 50},${110 - d.myScore}`).join(' ')"
                fill="none" stroke="#fb7185" stroke-width="1.5" stroke-dasharray="4 2" />
              <circle v-for="(d, i) in dailyLRW" :key="`ms${i}`"
                :cx="30 + i * 50" :cy="110 - d.myScore" r="3" fill="#fb7185" />

              <!-- X축 레이블 -->
              <text v-for="(d, i) in dailyLRW" :key="`xl${i}`"
                :x="30 + i * 50" y="118" text-anchor="middle" font-size="8" fill="#9ca3af">{{ d.day }}</text>
            </svg>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-rose-400 inline-block"></span> My Score</span>
            <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-gray-500 inline-block"></span> My ECC</span>
            <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-amber-400 inline-block"></span> All ECC</span>
          </div>
        </div>

        <!-- Speaking -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Speaking</h4>
          <div class="flex flex-wrap gap-3">
            <div v-for="d in speakingDays" :key="d.day" class="flex flex-col items-center gap-1">
              <span class="text-xs text-gray-400">{{ d.day }}</span>
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
                :class="d.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'"
              >
                {{ d.completed ? '✓' : '—' }}
              </div>
            </div>
          </div>
          <div class="flex gap-4 text-xs text-gray-400 mt-3">
            <span class="flex items-center gap-1">
              <span class="w-4 h-4 rounded-full bg-green-500 inline-flex items-center justify-center text-white text-xs font-bold">✓</span>
              Completed
            </span>
            <span class="flex items-center gap-1">
              <span class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 inline-block"></span>
              Not Completed
            </span>
          </div>
        </div>

        <!-- AI 코멘트 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 데이터 해석
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Daily LRW 반 평균은 80~88점대로 안정적입니다. My Score 데이터가 축적되면
            본인이 반 평균보다 높은 날·낮은 날을 확인하고 <strong>학습 패턴의 강약점</strong>을 파악할 수 있습니다.
            Speaking은 구어 능력과 직결되므로 모든 Day를 완료하는 것이 중요합니다.
            완료율이 높을수록 발음 교정 피드백 데이터도 풍부해집니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Achievement Test -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Achievement Test</h3>
      </template>
      <div class="space-y-4">
        <div class="flex gap-6 items-start">
          <!-- 수평 바 차트 -->
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-xs text-rose-400 w-16 flex-shrink-0">My Score</span>
              <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-5 relative">
                <div class="absolute left-0 top-0 h-full rounded bg-rose-400 transition-all" :style="`width: ${achievement.my}%`"></div>
                <span class="absolute left-2 top-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">{{ achievement.my }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-500 w-16 flex-shrink-0">My ECC</span>
              <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-5 relative">
                <div class="absolute left-0 top-0 h-full rounded bg-gray-500 transition-all" :style="`width: ${achievement.myEcc}%`"></div>
                <span class="absolute left-2 top-0.5 text-xs font-medium text-white">{{ achievement.myEcc }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-amber-500 w-16 flex-shrink-0">All ECC</span>
              <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-5 relative">
                <div class="absolute left-0 top-0 h-full rounded bg-amber-400 transition-all" :style="`width: ${achievement.allEcc}%`"></div>
                <span class="absolute left-2 top-0.5 text-xs font-medium text-white">{{ achievement.allEcc }}</span>
              </div>
            </div>
            <!-- X축 눈금 -->
            <div class="flex justify-between text-xs text-gray-400 pl-20">
              <span v-for="n in [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="n">{{ n }}</span>
            </div>
          </div>

          <!-- 범례 -->
          <div class="flex-shrink-0 space-y-2 text-xs">
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> My Score</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block"></span> My ECC</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> All ECC</div>
          </div>
        </div>

        <!-- AI 코멘트 -->
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 데이터 해석
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Achievement Test는 해당 Unit의 핵심 학습 목표 달성 여부를 측정합니다.
            반 평균 <strong>86점</strong>은 전체 평균(76점) 대비 높은 수준으로, 본 반의 학습 완성도가 우수합니다.
            테스트 점수는 <strong>Daily 학습 완료율과 강한 양의 상관관계</strong>가 있으므로,
            매일 학습을 빠짐없이 완료하는 것이 가장 효과적인 점수 향상 전략입니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Concentration Level -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Concentration Level</h3>
      </template>
      <div class="space-y-4">
        <div class="overflow-x-auto">
          <svg width="640" height="100" viewBox="0 0 640 100" class="w-full">
            <line v-for="y in [20, 40, 60, 80, 100]" :key="y"
              x1="30" :y1="95 - y * 0.9" x2="630" :y2="95 - y * 0.9"
              stroke="#e5e7eb" stroke-width="0.5" />
            <text v-for="y in [0, 20, 40, 60, 80, 100]" :key="`cl${y}`"
              x="24" :y="98 - y * 0.9" text-anchor="end" font-size="8" fill="#9ca3af">{{ y }}</text>

            <polyline
              :points="concentration.map((d, i) => `${30 + i * 50},${95 - d.score * 0.9}`).join(' ')"
              fill="none" stroke="#fb7185" stroke-width="1.5" stroke-dasharray="4 2" />
            <circle v-for="(d, i) in concentration" :key="`cc${i}`"
              :cx="30 + i * 50" :cy="95 - d.score * 0.9" r="3" fill="#fb7185" />
            <text v-for="(d, i) in concentration" :key="`cv${i}`"
              :x="30 + i * 50" :y="95 - d.score * 0.9 - 6" text-anchor="middle" font-size="8" fill="#9ca3af">{{ d.score }}</text>

            <text v-for="(d, i) in concentration" :key="`cx${i}`"
              :x="30 + i * 50" y="100" text-anchor="middle" font-size="8" fill="#9ca3af">{{ d.day }}</text>
          </svg>
        </div>
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 데이터 해석
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Concentration Level은 학습 세션 내 <strong>활동 완료 속도 + 오답률 + 재시도 횟수</strong>를 복합 산출한 집중도 지수입니다.
            데이터가 누적될수록 학생의 <strong>최적 학습 시간대</strong>와 <strong>집중력 저하 패턴</strong>을 분석할 수 있어,
            개인 맞춤 학습 일정 설계에 활용됩니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Achievement Progress -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Achievement Progress</h3>
      </template>
      <div class="space-y-4">
        <div class="overflow-x-auto">
          <svg width="540" height="110" viewBox="0 0 540 110" class="w-full">
            <line v-for="y in [20, 40, 60, 80, 100]" :key="y"
              x1="30" :y1="100 - y" x2="530" :y2="100 - y"
              stroke="#e5e7eb" stroke-width="0.5" />
            <text v-for="y in [0, 20, 40, 60, 80, 100]" :key="`ap${y}`"
              x="24" :y="103 - y" text-anchor="end" font-size="8" fill="#9ca3af">{{ y }}</text>

            <!-- My ECC -->
            <polyline
              :points="progressTrend.map((d, i) => `${30 + i * 100},${100 - d.myEcc}`).join(' ')"
              fill="none" stroke="#6b7280" stroke-width="1.5" />
            <circle v-for="(d, i) in progressTrend" :key="`pm${i}`"
              :cx="30 + i * 100" :cy="100 - d.myEcc" r="3" fill="#6b7280" />

            <!-- All ECC -->
            <polyline
              :points="progressTrend.map((d, i) => `${30 + i * 100},${100 - d.allEcc}`).join(' ')"
              fill="none" stroke="#f59e0b" stroke-width="1.5" />
            <circle v-for="(d, i) in progressTrend" :key="`pa${i}`"
              :cx="30 + i * 100" :cy="100 - d.allEcc" r="3" fill="#f59e0b" />

            <!-- My Score -->
            <polyline
              :points="progressTrend.map((d, i) => `${30 + i * 100},${100 - d.myScore}`).join(' ')"
              fill="none" stroke="#fb7185" stroke-width="1.5" stroke-dasharray="4 2" />
            <circle v-for="(d, i) in progressTrend" :key="`ps${i}`"
              :cx="30 + i * 100" :cy="100 - d.myScore" r="3" fill="#fb7185" />

            <text v-for="(d, i) in progressTrend" :key="`pw${i}`"
              :x="30 + i * 100" y="108" text-anchor="middle" font-size="8" fill="#9ca3af">{{ d.week }}</text>
          </svg>
        </div>
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-rose-400 inline-block"></span> My Score</span>
          <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-gray-500 inline-block"></span> My ECC</span>
          <span class="flex items-center gap-1"><span class="w-4 h-0.5 bg-amber-400 inline-block"></span> All ECC</span>
        </div>
        <div class="rounded-lg bg-primary-50 dark:bg-primary-950 p-4 space-y-2">
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            AI 데이터 해석
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            주차별 Achievement Progress는 <strong>학습 성취의 누적 성장 궤적</strong>을 보여줍니다.
            반 평균(My ECC)이 W1→W6 기준 80점 → 88점으로 지속 상승하는 패턴은
            커리큘럼의 단계적 심화가 효과적으로 작동하고 있음을 나타냅니다.
            My Score 데이터가 쌓이면 본인의 성장 속도와 반 평균의 차이를 주차별로 추적할 수 있습니다.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Strength Analysis (AI 종합) -->
    <UCard class="border-primary-200 dark:border-primary-800">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">AI 종합 분석</h3>
        </div>
      </template>
      <div class="space-y-5">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ ai.summary }}</p>

        <!-- 데이터 인사이트 카드 3개 -->
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="insight in ai.dataInsights" :key="insight.title"
            class="rounded-lg p-4 space-y-1.5"
            :class="insight.bg"
          >
            <div class="flex items-center gap-2">
              <UIcon :name="insight.icon" class="w-4 h-4" :class="insight.color" />
              <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ insight.title }}</span>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ insight.content }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- 강점 -->
          <div class="rounded-lg bg-green-50 dark:bg-green-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-thumbs-up" class="w-4 h-4 text-green-600" />
              <span class="text-sm font-semibold text-green-700 dark:text-green-400">학습 환경 강점</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(s, i) in ai.strengths" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-green-500 flex-shrink-0 mt-0.5">✓</span>{{ s }}
              </li>
            </ul>
          </div>
          <!-- 개선점 -->
          <div class="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-target" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">개선 필요 항목</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(s, i) in ai.improvements" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="text-orange-400 flex-shrink-0 mt-0.5">→</span>{{ s }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 향후 학습 방향 & 가이드 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-route" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">향후 학습 방향 & 가이드</h3>
        </div>
      </template>
      <div class="space-y-5">

        <!-- 3단계 로드맵 -->
        <div class="space-y-4">
          <div
            v-for="phase in ai.learningGuide" :key="phase.phase"
            class="rounded-lg border-l-4 p-4 bg-gray-50 dark:bg-gray-800/50"
            :class="phase.color"
          >
            <div class="flex items-center gap-2 mb-3">
              <UIcon :name="phase.icon" class="w-4 h-4" :class="phase.titleColor" />
              <span class="text-sm font-semibold" :class="phase.titleColor">{{ phase.phase }}</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(item, i) in phase.items" :key="i" class="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span class="flex-shrink-0 mt-0.5 text-gray-400">{{ i + 1 }}.</span>{{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 다음 레벨 추천 -->
        <div class="flex items-start gap-4 p-4 rounded-lg bg-primary-50 dark:bg-primary-950">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <UIcon name="i-lucide-arrow-up-circle" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              추천 다음 레벨: <span class="text-primary-600 dark:text-primary-400">{{ ai.nextLevel.recommendation }}</span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ ai.nextLevel.condition }}</p>
          </div>
        </div>

        <!-- 집중 목표 뱃지 -->
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">레벨업 달성을 위한 집중 목표</p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(focus, i) in ai.nextLevel.focus" :key="i"
              color="primary" variant="soft" size="lg"
            >
              {{ focus }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Print 버튼 (하단) -->
    <div class="flex justify-center pb-4">
      <UButton icon="i-lucide-printer" variant="solid" color="primary" size="lg">Print</UButton>
    </div>

  </div>
</template>
