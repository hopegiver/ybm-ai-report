<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const periodStart = '2026-04-14'
const periodEnd = '2026-05-29'

const { students: rawStudents, onlineRecords } = useStudentData()

const allStudents = rawStudents
  .filter(s => onlineRecords.some(o => o.studentId === s.id))
  .map(s => {
    const online = onlineRecords.find(o => o.studentId === s.id)!
    return { id: s.id, name: s.name, nickname: s.nickname, curriculum: s.curriculum, day: s.day, level: s.level, daily: online.daily, logical: online.logical, jet: online.jet, iseed: online.iseed }
  })

const curriculumOptions = ['전체', ...Array.from(new Set(allStudents.map(r => r.curriculum)))]
const dayOptions = ['전체', ...Array.from(new Set(allStudents.map(r => r.day)))]
const levelOptions = ['전체', ...Array.from(new Set(allStudents.map(r => r.level)))]

const route = useRoute()
const filterCurriculum = ref('전체')
const filterDay = ref('전체')
const filterLevel = ref('전체')
const filterName = ref((route.query.search as string) || '')

const students = computed(() =>
  allStudents.filter(r => {
    if (filterCurriculum.value !== '전체' && r.curriculum !== filterCurriculum.value) return false
    if (filterDay.value !== '전체' && r.day !== filterDay.value) return false
    if (filterLevel.value !== '전체' && r.level !== filterLevel.value) return false
    if (filterName.value.trim() && !r.name.includes(filterName.value.trim())) return false
    return true
  })
)

const dailyHeaders = Array.from({ length: 12 }, (_, i) => `D${i + 1}`)
const logicalHeaders = ['W1', 'W2', 'W3', 'W4']
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Online Scores 리포트</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Online Scores 리포트를 관리하고 검토합니다.</p>
    </div>

    <!-- 필터 -->
    <UCard>
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="Curriculum">
          <USelect v-model="filterCurriculum" :items="curriculumOptions" class="w-52" />
        </UFormField>
        <UFormField label="Day">
          <USelect v-model="filterDay" :items="dayOptions" class="w-52" />
        </UFormField>
        <UFormField label="Level">
          <USelect v-model="filterLevel" :items="levelOptions" class="w-36" />
        </UFormField>
        <UFormField label="이름">
          <UInput v-model="filterName" placeholder="이름 검색" icon="i-lucide-search" class="w-36" />
        </UFormField>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="filterCurriculum = '전체'; filterDay = '전체'; filterLevel = '전체'; filterName = ''"
        >
          초기화
        </UButton>
      </div>
    </UCard>

    <UCard :ui="{ body: 'p-0 overflow-x-auto' }">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            iLearning Scores ({{ periodStart }}~{{ periodEnd }})
          </span>
          <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1">
              <span class="inline-block w-3 h-3 rounded-sm bg-green-500"></span> Completed
            </span>
            <span class="flex items-center gap-1">
              <span class="inline-block w-3 h-3 rounded-sm bg-orange-400"></span> Rating
            </span>
          </div>
        </div>
      </template>

      <table class="w-full text-sm border-collapse">
        <!-- 그룹 헤더 -->
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th
              rowspan="2"
              class="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 w-28 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10"
            >
              Name
            </th>
            <th
              colspan="12"
              class="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700"
            >
              Daily Home Study
            </th>
            <th
              colspan="4"
              class="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700"
            >
              Logical Speaking
            </th>
            <th
              rowspan="2"
              class="px-3 py-2 text-center font-semibold text-white bg-gray-800 dark:bg-gray-600 border-r border-gray-200 dark:border-gray-700 w-14"
            >
              JET<br />M1
            </th>
            <th
              rowspan="2"
              class="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 w-16"
            >
              iSeed
            </th>
            <th
              rowspan="2"
              class="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 w-20"
            >
              Report
            </th>
            <th
              rowspan="2"
              class="px-3 py-2 text-center font-semibold text-primary-600 dark:text-primary-400 w-24"
            >
              AI Report
            </th>
          </tr>
          <!-- 서브 헤더 -->
          <tr class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th
              v-for="h in dailyHeaders"
              :key="h"
              class="px-2 py-1.5 text-center font-medium text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700 w-12"
            >
              {{ h }}
            </th>
            <th
              v-for="h in logicalHeaders"
              :key="h"
              class="px-2 py-1.5 text-center font-medium text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700 w-12"
            >
              {{ h }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="student in students"
            :key="student.id"
            class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <!-- Name -->
            <td class="px-3 py-2 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10">
              <div class="font-medium text-gray-900 dark:text-white text-sm">{{ student.name }}</div>
              <div v-if="student.nickname" class="text-xs text-gray-500 dark:text-gray-400">{{ student.nickname }}</div>
            </td>

            <!-- Daily Home Study D1~D12 -->
            <td
              v-for="(score, i) in student.daily"
              :key="`d${i}`"
              class="px-2 py-2 text-center border-r border-gray-100 dark:border-gray-800"
            >
              <a
                v-if="score !== null"
                href="#"
                class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >{{ score }}</a>
              <span v-else class="text-gray-300 dark:text-gray-600">-</span>
            </td>

            <!-- Logical Speaking W1~W4 -->
            <td
              v-for="(score, i) in student.logical"
              :key="`w${i}`"
              class="px-2 py-2 text-center border-r border-gray-100 dark:border-gray-800"
            >
              <a
                v-if="score !== null"
                href="#"
                class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >{{ score }}</a>
              <span v-else class="text-gray-300 dark:text-gray-600">-</span>
            </td>

            <!-- JET M1 -->
            <td class="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-700">
              <a
                v-if="student.jet !== null"
                href="#"
                class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >{{ student.jet }}</a>
              <span v-else class="text-gray-300 dark:text-gray-600">-</span>
            </td>

            <!-- iSeed -->
            <td class="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-700">
              <span
                :class="student.iseed > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'"
              >{{ student.iseed }}</span>
            </td>

            <!-- Report -->
            <td class="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-700">
              <UButton
                size="xs"
                variant="outline"
                color="neutral"
                :to="`/reports/online-scores/${student.id}`"
              >
                [Report]
              </UButton>
            </td>

            <!-- AI Report -->
            <td class="px-2 py-2 text-center">
              <UButton
                size="xs"
                variant="soft"
                color="primary"
                icon="i-lucide-sparkles"
                :to="`/reports/online-scores/${student.id}`"
              >
                AI Report
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </div>
</template>
