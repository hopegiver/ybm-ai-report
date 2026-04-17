<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const id = Number(route.params.id)

const { students, rsaRecords, yeptRecords, onlineRecords } = useStudentData()

const student = students.find(s => s.id === id)
if (!student) {
  navigateTo('/reports/mobyread', { replace: true })
}

// 학생별 mock 리포트 데이터 생성
function getMockReport(studentId: number) {
  const rsa = rsaRecords.find(r => r.studentId === studentId)
  const yept = yeptRecords.find(r => r.studentId === studentId)
  const online = onlineRecords.find(r => r.studentId === studentId)

  // 학생 ID 기반으로 약간씩 다른 데이터 생성
  const seed = studentId
  const comprehension = 80 + (seed * 3 % 20)
  const accuracy = 85 + (seed * 2 % 15)
  const expression = 70 + (seed * 4 % 25)

  const avgComp = comprehension - 3 - (seed % 5)
  const avgAcc = accuracy - (seed % 4)
  const avgExp = expression - 5

  const compDelta = comprehension - avgComp
  const accDelta = accuracy - avgAcc
  const expDelta = expression - avgExp

  // WCPM 데이터 (Word Correct Per Minute) - 최근 5회 평가
  const baseWcpm = 80 + seed * 5
  const wcpmData = [
    { date: '1 Mar', wcpm: baseWcpm },
    { date: '8 Mar', wcpm: baseWcpm + 5 },
    { date: '15 Mar', wcpm: baseWcpm + 3 },
    { date: '24 Mar', wcpm: baseWcpm + 8 },
    { date: '31 Mar', wcpm: baseWcpm + 10 },
  ]
  const currentWcpm = baseWcpm + 10
  const schoolAvgWcpm = baseWcpm + 2
  const isAboveAvg = currentWcpm > schoolAvgWcpm

  // Progress 텍스트
  const s = student!
  const progressItems = [
    `${s.nickname || s.name}의 읽기 속도가 꾸준히 향상되고 있으며 평균 이상을 유지하고 있습니다.`,
    `${s.nickname || s.name}의 이해력은 읽기 속도 향상으로 인해 ${compDelta >= 0 ? '소폭 상승' : '소폭 하락'}하였습니다.`,
    `${s.nickname || s.name}의 정확도는 ${accDelta === 0 ? '변화 없이 유지되고 있습니다.' : accDelta > 0 ? '향상되고 있습니다.' : '소폭 하락하였습니다.'}`,
    `${s.nickname || s.name}은(는) 표현력에서 ${expression >= 80 ? '우수한' : '꾸준한'} 성장을 보였습니다.`,
  ]

  // Words & Chunks (독해 중 새로 습득한 단어)
  const wordSets = [
    ['bucket', 'sharp', 'parrot', 'screech', 'ladle', 'tureen', 'marsupial', 'koala'],
    ['gallop', 'meadow', 'harvest', 'furrow', 'blossom', 'scatter', 'shimmer'],
    ['cunning', 'prowl', 'burrow', 'frantic', 'glimmer', 'hollow', 'perch'],
    ['marvel', 'glide', 'soar', 'plunge', 'cascade', 'ripple', 'surge'],
    ['weave', 'tangle', 'drift', 'flicker', 'rustle', 'murmur', 'stride'],
  ]
  const chunkSets = [
    ['give up', 'take care of', 'come up with', 'deal with', 'look after'],
    ['set off', 'run into', 'figure out', 'look forward to', 'get along'],
    ['break down', 'carry out', 'turn around', 'bring about', 'hold on'],
    ['put off', 'take over', 'make up for', 'catch up with', 'give away'],
    ['stand out', 'go over', 'point out', 'keep up with', 'pass on'],
  ]
  const words = wordSets[(seed - 1) % wordSets.length]
  const chunks = chunkSets[(seed - 1) % chunkSets.length]

  // Insights
  const insights = [
    {
      num: 1,
      title: '문법: 전치사',
      wrong: '"The fish is on the water..."',
      correct: '"The fish is in the water..."',
    },
    {
      num: 2,
      title: '문법: 완전한 문장',
      note: '질문에 답할 때 완전한 문장으로 말하는 연습이 필요합니다.',
      wrong: seed % 2 === 0 ? '"the bear"' : '"running fast"',
      correct: seed % 2 === 0 ? '"The bear scared the girl."' : '"He was running very fast."',
      isQA: true,
      question: seed % 2 === 0 ? 'Q: Why was the girl scared?' : 'Q: How did he move?',
    },
    {
      num: 3,
      title: '연습할 단어',
      words: ['marsupial', 'magnifying', 'baggage'].slice(0, 2 + (seed % 2)),
    },
  ]

  // Practice 조언
  const practice = [
    {
      text: '빠르게 읽는 연습을 계속하되 표현력을 소홀히 하지 않도록 합니다.',
    },
    {
      text: '매일 천천히 읽는 연습을 통해 이해력 향상에 집중합니다.',
    },
  ]

  // Teacher Feedback
  const feedbacks = [
    `${s.nickname || s.name}은(는) 수업에서 늘 즐거운 분위기를 만들어 주며 읽기 실력도 꾸준히 향상되고 있습니다. 다만 읽는 내용에 집중하지 못해 중요한 세부 내용을 놓치는 경우가 있습니다. 이해하지 못한 부분이 있을 때는 멈추고 확인하는 습관을 기를 수 있도록 계속 지도하겠습니다.`,
    `${s.nickname || s.name}은(는) 유창성과 표현력에서 큰 발전을 보이고 있으며 이해력 점수도 꾸준히 높게 유지되고 있습니다. 다음 기간에는 레벨 전환을 대비해 문법과 어휘 확장에 집중할 예정입니다.`,
    `${s.nickname || s.name}은(는) 읽기 속도에서 눈에 띄는 향상을 보였습니다. 독서에 대한 열정이 매우 돋보입니다. 앞으로는 텍스트에 대한 분석적 질문을 통해 이해력을 더욱 심화시켜 나가겠습니다.`,
  ]
  const teacherFeedback = feedbacks[(seed - 1) % feedbacks.length]

  // Evaluations 테이블
  const evalBooks = [
    { date: '2026.03.01', title: 'The History of the Auto...', wcpm: 100, accuracy: '독립 - 100%',   comprehension: '8문제 중 7', expression: '4문제 중 3' },
    { date: '2026.03.08', title: "Sally's New Pet",            wcpm: 105, accuracy: '독립 - 100%',   comprehension: '8문제 중 3', expression: '4문제 중 1' },
    { date: '2026.03.15', title: "Samantha's Balloon",        wcpm: 95,  accuracy: '좌절 - 84%',    comprehension: '8문제 중 4', expression: '4문제 중 4' },
    { date: '2026.03.24', title: 'Vegetable Garden',          wcpm: 90,  accuracy: '지도 필요 - 90%', comprehension: '8문제 중 2', expression: '4문제 중 3' },
    { date: '2026.03.31', title: 'Ping Pong',                 wcpm: 85,  accuracy: '지도 필요 - 90%', comprehension: '8문제 중 5', expression: '4문제 중 2' },
  ]

  return {
    comprehension, accuracy, expression,
    avgComp, avgAcc, avgExp,
    compDelta, accDelta, expDelta,
    wcpmData, currentWcpm, schoolAvgWcpm, isAboveAvg,
    progressItems, words, chunks, insights, practice,
    teacherFeedback, evalBooks,
    rsa, yept, online,
    reportDate: '2026년 4월 9일',
    period: '2026년 3월 1일 - 3월 31일',
    reportDateShort: '2026년 4월 8일',
    grade: '2학년',
    group: '1반',
    district: '1지구',
    school: '모비리드 학교',
  }
}

const report = student ? getMockReport(id) : null

// WCPM 차트용 SVG path 계산
function buildWcpmPath(data: { date: string; wcpm: number }[]) {
  if (!data.length) return ''
  const W = 220, H = 60, pad = 8
  const minV = Math.min(...data.map(d => d.wcpm)) - 10
  const maxV = Math.max(...data.map(d => d.wcpm)) + 10
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2))
  const ys = data.map(d => H - pad - ((d.wcpm - minV) / (maxV - minV)) * (H - pad * 2))
  return xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
}

function accuracyColor(text: string) {
  if (text.startsWith('독립')) return 'text-green-600 dark:text-green-400'
  if (text.startsWith('지도')) return 'text-orange-500 dark:text-orange-400'
  if (text.startsWith('좌절')) return 'text-red-500 dark:text-red-400'
  return 'text-gray-600'
}

const evalColumns = [
  { accessorKey: 'date',          header: '날짜' },
  { accessorKey: 'title',         header: '도서명' },
  { accessorKey: 'wcpm',          header: 'mWCPM' },
  { accessorKey: 'accuracy',      header: '정확도' },
  { accessorKey: 'comprehension', header: '이해력' },
  { accessorKey: 'expression',    header: '표현력' },
]
</script>

<template>
  <div v-if="student && report" class="p-6 space-y-6 max-w-5xl mx-auto">

    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/reports/mobyread" />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI 성과 리포트</h2>
            <UBadge color="primary" variant="soft" icon="i-lucide-sparkles">AI 분석</UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Moby Read — {{ student.curriculum }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-400">{{ report.reportDate }}</span>
        <UButton icon="i-lucide-printer" variant="outline" color="neutral">인쇄</UButton>
      </div>
    </div>

    <!-- ① 학생 기본 정보 -->
    <UCard>
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ student.name }}
            <span v-if="student.nickname" class="text-lg font-normal text-gray-500">({{ student.nickname }})</span>
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 flex-shrink-0" />
            지역: {{ report.district }}
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-graduation-cap" class="w-4 h-4 flex-shrink-0" />
            학년: {{ report.grade }}
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-building2" class="w-4 h-4 flex-shrink-0" />
            학원: {{ report.school }}
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-users" class="w-4 h-4 flex-shrink-0" />
            반: {{ report.group }}
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-calendar" class="w-4 h-4 flex-shrink-0" />
            리포트 날짜: {{ report.reportDateShort }}
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-clock" class="w-4 h-4 flex-shrink-0" />
            기간: {{ report.period }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- ② Level + ③ WCPM + ④ 지표 -->
    <div class="grid grid-cols-[180px_1fr_auto] gap-4">
      <!-- ② Level -->
      <UCard>
        <div class="flex flex-col items-start gap-1">
          <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <UIcon name="i-lucide-layers" class="w-3.5 h-3.5" />
            레벨
          </div>
          <div class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ student.level.split(' ')[0] }}<span class="text-red-500">·</span>
          </div>
          <div class="text-base font-semibold text-gray-700 dark:text-gray-300">
            {{ student.level }}
          </div>
        </div>
      </UCard>

      <!-- ③ WCPM 차트 -->
      <UCard>
        <div class="flex flex-col gap-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">WCPM (분당 정확히 읽은 단어 수)</div>
          <div class="flex items-end gap-4">
            <div>
              <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ report.currentWcpm }}</span>
              <span class="text-sm text-gray-400 ml-1">WCPM</span>
            </div>
            <svg width="220" height="60" class="flex-shrink-0">
              <polyline
                :points="report.wcpmData.map((d, i) => {
                  const W = 220, H = 60, pad = 8
                  const minV = Math.min(...report.wcpmData.map(x => x.wcpm)) - 10
                  const maxV = Math.max(...report.wcpmData.map(x => x.wcpm)) + 10
                  const x = pad + (i / (report.wcpmData.length - 1)) * (W - pad * 2)
                  const y = H - pad - ((d.wcpm - minV) / (maxV - minV)) * (H - pad * 2)
                  return `${x.toFixed(1)},${y.toFixed(1)}`
                }).join(' ')"
                fill="none"
                stroke="#ef4444"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-for="(d, i) in report.wcpmData" :key="i"
                :cx="(8 + (i / (report.wcpmData.length - 1)) * 204).toFixed(1)"
                :cy="(60 - 8 - ((d.wcpm - (Math.min(...report.wcpmData.map(x => x.wcpm)) - 10)) / ((Math.max(...report.wcpmData.map(x => x.wcpm)) + 10) - (Math.min(...report.wcpmData.map(x => x.wcpm)) - 10))) * 44).toFixed(1)"
                r="3"
                fill="#ef4444"
              />
            </svg>
          </div>
          <p class="text-xs">
            학원 평균 대비
            <span :class="report.isAboveAvg ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'">
              {{ report.isAboveAvg ? '상위' : '하위' }}
            </span>
            수준입니다.
          </p>
        </div>
      </UCard>

      <!-- ④ Comprehension / Accuracy / Expression -->
      <div class="flex gap-3">
        <!-- Comprehension -->
        <UCard class="min-w-[130px]">
          <div class="flex flex-col items-center gap-1">
            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <UIcon name="i-lucide-brain" class="w-3.5 h-3.5" />
              이해력
            </div>
            <div class="text-4xl font-black text-gray-900 dark:text-white">{{ report.comprehension }}%</div>
            <div class="flex items-center gap-1 text-xs">
              <UIcon
                :name="report.compDelta > 0 ? 'i-lucide-trending-up' : report.compDelta < 0 ? 'i-lucide-trending-down' : 'i-lucide-minus'"
                class="w-3.5 h-3.5"
                :class="report.compDelta > 0 ? 'text-green-500' : report.compDelta < 0 ? 'text-red-400' : 'text-gray-400'"
              />
              <span :class="report.compDelta > 0 ? 'text-green-500' : report.compDelta < 0 ? 'text-red-400' : 'text-gray-400'">
                {{ report.compDelta > 0 ? '+' : '' }}{{ report.compDelta }}%
              </span>
            </div>
            <div class="text-xs text-gray-400">Avg : {{ report.avgComp }}%</div>
          </div>
        </UCard>
        <!-- Accuracy -->
        <UCard class="min-w-[120px]">
          <div class="flex flex-col items-center gap-1">
            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <UIcon name="i-lucide-target" class="w-3.5 h-3.5" />
              정확도
            </div>
            <div class="text-4xl font-black text-gray-900 dark:text-white">{{ report.accuracy }}%</div>
            <div class="flex items-center gap-1 text-xs">
              <UIcon
                :name="report.accDelta > 0 ? 'i-lucide-trending-up' : report.accDelta < 0 ? 'i-lucide-trending-down' : 'i-lucide-minus'"
                class="w-3.5 h-3.5"
                :class="report.accDelta > 0 ? 'text-green-500' : report.accDelta < 0 ? 'text-red-400' : 'text-gray-400'"
              />
              <span :class="report.accDelta > 0 ? 'text-green-500' : report.accDelta < 0 ? 'text-red-400' : 'text-gray-400'">
                {{ report.accDelta > 0 ? '+' : '' }}{{ report.accDelta }}%
              </span>
            </div>
            <div class="text-xs text-gray-400">Avg : {{ report.avgAcc }}%</div>
          </div>
        </UCard>
        <!-- Expression -->
        <UCard class="min-w-[120px]">
          <div class="flex flex-col items-center gap-1">
            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <UIcon name="i-lucide-mic" class="w-3.5 h-3.5" />
              표현력
            </div>
            <div class="text-4xl font-black" :class="report.expDelta >= 0 ? 'text-orange-500' : 'text-red-500'">{{ report.expression }}%</div>
            <div class="flex items-center gap-1 text-xs">
              <UIcon
                :name="report.expDelta > 0 ? 'i-lucide-trending-up' : report.expDelta < 0 ? 'i-lucide-trending-down' : 'i-lucide-minus'"
                class="w-3.5 h-3.5"
                :class="report.expDelta > 0 ? 'text-green-500' : report.expDelta < 0 ? 'text-orange-400' : 'text-gray-400'"
              />
              <span :class="report.expDelta > 0 ? 'text-green-500' : report.expDelta < 0 ? 'text-orange-400' : 'text-gray-400'">
                {{ report.expDelta > 0 ? '+' : '' }}{{ report.expDelta }}%
              </span>
            </div>
            <div class="text-xs text-gray-400">Avg : {{ report.avgExp }}%</div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- ⑤ Progress + Words / Chunks -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Progress -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-primary-500" />
            진행 상황
          </div>
        </template>
        <ul class="space-y-2">
          <li
            v-for="(item, i) in report.progressItems" :key="i"
            class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
            {{ item }}
          </li>
        </ul>
      </UCard>

      <!-- Words + Chunks -->
      <UCard>
        <!-- Words -->
        <div class="mb-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <UIcon name="i-lucide-book-open" class="w-4 h-4 text-primary-500" />
            단어
          </div>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="word in report.words" :key="word"
              color="neutral"
              variant="outline"
              size="sm"
              class="font-normal"
            >
              {{ word }}
            </UBadge>
          </div>
        </div>
        <!-- Chunks -->
        <div>
          <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <UIcon name="i-lucide-layers" class="w-4 h-4 text-primary-500" />
            청크 (숙어)
          </div>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="chunk in report.chunks" :key="chunk"
              color="primary"
              variant="soft"
              size="sm"
              class="font-normal"
            >
              {{ chunk }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Practice + Insights -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Practice -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <UIcon name="i-lucide-dumbbell" class="w-4 h-4 text-primary-500" />
            연습 방향
          </div>
        </template>
        <div class="grid grid-cols-2 gap-4">
          <p v-for="(p, i) in report.practice" :key="i" class="text-sm text-gray-600 dark:text-gray-400">
            {{ p.text }}
          </p>
        </div>
      </UCard>

      <!-- Insights -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary-500" />
            학습 인사이트
          </div>
        </template>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="insight in report.insights" :key="insight.num"
            class="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                {{ insight.num }}
              </span>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ insight.title }}</span>
            </div>
            <!-- Grammar insight -->
            <template v-if="insight.wrong && !insight.isQA">
              <p class="text-xs text-red-500">오답: {{ insight.wrong }}</p>
              <p class="text-xs text-green-600">정답: {{ insight.correct }}</p>
            </template>
            <!-- QA insight -->
            <template v-else-if="insight.isQA">
              <p class="text-xs text-gray-500">{{ insight.note }}</p>
              <p class="text-xs text-gray-500">{{ insight.question }}</p>
              <p class="text-xs text-red-500">오답: {{ insight.wrong }}</p>
              <p class="text-xs text-green-600">정답: {{ insight.correct }}</p>
            </template>
            <!-- Words to practice -->
            <template v-else-if="insight.words">
              <div class="flex flex-wrap gap-1">
                <span v-for="w in insight.words" :key="w" class="text-xs text-gray-600 dark:text-gray-400">{{ w }},</span>
              </div>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ⑥ Teacher Feedback -->
    <UCard class="border-l-4 border-l-primary-500">
      <template #header>
        <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <UIcon name="i-lucide-message-square" class="w-4 h-4 text-primary-500" />
          선생님 피드백
        </div>
      </template>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ report.teacherFeedback }}
      </p>
    </UCard>

    <!-- ⑦ Evaluations -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <UIcon name="i-lucide-table" class="w-4 h-4 text-primary-500" />
          평가 기록
        </div>
      </template>
      <UTable :data="report.evalBooks" :columns="evalColumns">
        <template #title-cell="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.original.title }}</span>
        </template>
        <template #wcpm-cell="{ row }">
          <span class="font-semibold text-gray-900 dark:text-white">{{ row.original.wcpm }}</span>
        </template>
        <template #accuracy-cell="{ row }">
          <span class="text-sm font-medium" :class="accuracyColor(row.original.accuracy)">
            {{ row.original.accuracy }}
          </span>
        </template>
        <template #comprehension-cell="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.original.comprehension }}</span>
        </template>
        <template #expression-cell="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.original.expression }}</span>
        </template>
      </UTable>
    </UCard>

    <!-- ⑧ 푸터 -->
    <div class="flex flex-col items-center gap-2 py-4 border-t border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-book-open-check" class="w-6 h-6 text-primary-500" />
        <span class="text-lg font-black tracking-wide text-gray-900 dark:text-white">MOBY. READ<span class="text-primary-500">+</span></span>
      </div>
      <p class="text-xs text-gray-400">© 2026 AI Moby.Plus Inc. | AI Powered Literacy Assessment Solution</p>
    </div>

  </div>
</template>
