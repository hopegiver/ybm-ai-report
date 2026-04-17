<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const router = useRouter()
const { students, searchStudents, getStudentReports, generateAiAnalysis } = useStudentData()
const { create } = useConsults()

const step = ref(1)

const searchQuery = ref('')
const selectedStudent = ref<typeof students[0] | null>(null)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return students
  return searchStudents(searchQuery.value)
})

function selectStudent(s: typeof students[0]) {
  selectedStudent.value = s
  step.value = 2
}

const reports = computed(() => {
  if (!selectedStudent.value) return null
  return getStudentReports(selectedStudent.value.id)
})

const aiAnalysis = computed(() => {
  if (!selectedStudent.value) return null
  return generateAiAnalysis(selectedStudent.value.id)
})

const consultant = ref('')
const scheduledAt = ref('')

function submit() {
  if (!selectedStudent.value || !consultant.value || !scheduledAt.value) return
  const s = selectedStudent.value
  const newConsult = create({
    studentId: s.id,
    studentName: s.name,
    academy: s.academy,
    curriculum: s.curriculum,
    level: s.level,
    consultant: consultant.value,
    scheduledAt: scheduledAt.value,
  })
  router.push(`/consults/${newConsult.id}`)
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
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- 헤더 -->
    <div class="flex items-center gap-3">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" to="/consults" />
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">상담 등록</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">학생을 선택하고 리포트를 확인한 후 상담을 등록합니다.</p>
      </div>
    </div>

    <!-- 스텝 인디케이터 -->
    <div class="flex items-center gap-2">
      <div
        v-for="(label, i) in ['학생 선택', '리포트 확인 및 등록']"
        :key="i"
        class="flex items-center gap-2"
      >
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          :class="step > i + 1
            ? 'bg-green-500 text-white'
            : step === i + 1
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'"
        >
          <UIcon v-if="step > i + 1" name="i-lucide-check" class="w-3.5 h-3.5" />
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span
          class="text-sm"
          :class="step === i + 1 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400'"
        >{{ label }}</span>
        <UIcon v-if="i < 1" name="i-lucide-chevron-right" class="w-4 h-4 text-gray-300" />
      </div>
    </div>

    <!-- STEP 1: 학생 선택 -->
    <template v-if="step === 1">
      <UCard>
        <template #header>
          <p class="font-medium text-gray-900 dark:text-white">학생 검색</p>
        </template>
        <div class="space-y-4">
          <UInput
            v-model="searchQuery"
            placeholder="이름, 닉네임, 학원으로 검색..."
            icon="i-lucide-search"
            class="max-w-sm"
          />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="s in searchResults"
              :key="s.id"
              class="text-left p-4 rounded-lg border-2 transition-all hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30"
              :class="selectedStudent?.id === s.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-gray-200 dark:border-gray-700'"
              @click="selectStudent(s)"
            >
              <div class="flex items-center gap-3">
                <UAvatar
                  :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`"
                  :alt="s.name"
                  size="md"
                />
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ s.name }}
                    <span v-if="s.nickname" class="text-sm font-normal text-gray-500 ml-1">({{ s.nickname }})</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ s.academy }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <UBadge color="neutral" variant="outline" size="xs">{{ s.curriculum }}</UBadge>
                    <UBadge color="primary" variant="soft" size="xs">{{ s.level }}</UBadge>
                  </div>
                </div>
              </div>
            </button>
          </div>
          <p v-if="searchResults.length === 0" class="text-sm text-gray-400 text-center py-4">
            검색 결과가 없습니다.
          </p>
        </div>
      </UCard>
    </template>

    <!-- STEP 2: 리포트 확인 + 등록 폼 -->
    <template v-if="step === 2 && selectedStudent && reports">
      <!-- 선택된 학생 카드 -->
      <UCard>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`"
              :alt="selectedStudent.name"
              size="lg"
            />
            <div>
              <p class="font-semibold text-lg text-gray-900 dark:text-white">
                {{ selectedStudent.name }}
                <span v-if="selectedStudent.nickname" class="text-base font-normal text-gray-500 ml-1">({{ selectedStudent.nickname }})</span>
              </p>
              <p class="text-sm text-gray-500">{{ selectedStudent.academy }}</p>
              <div class="flex items-center gap-2 mt-1">
                <UBadge color="neutral" variant="outline" size="sm">{{ selectedStudent.curriculum }}</UBadge>
                <UBadge color="primary" variant="soft" size="sm">{{ selectedStudent.level }}</UBadge>
                <UBadge color="neutral" variant="soft" size="sm">{{ selectedStudent.day }}</UBadge>
              </div>
            </div>
          </div>
          <UButton variant="ghost" color="neutral" size="sm" icon="i-lucide-pencil" @click="step = 1">
            변경
          </UButton>
        </div>
      </UCard>

      <!-- 통합 리포트 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <!-- AI 분석 -->
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

      <!-- 등록 폼 -->
      <UCard>
        <template #header>
          <p class="font-medium text-gray-900 dark:text-white">상담 정보 입력</p>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="담당강사" required>
            <UInput v-model="consultant" placeholder="강사명 입력" class="w-full" />
          </UFormField>
          <UFormField label="상담 예정일" required>
            <UInput v-model="scheduledAt" type="date" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <UButton variant="outline" color="neutral" @click="step = 1">이전</UButton>
          <UButton
            icon="i-lucide-clipboard-check"
            :disabled="!consultant || !scheduledAt"
            @click="submit"
          >
            상담 등록
          </UButton>
        </div>
      </UCard>
    </template>
  </div>
</template>
