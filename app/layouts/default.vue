<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const reportsOpen = ref(false)
const searchInput = ref('')

function goSearch() {
  const q = searchInput.value.trim()
  if (!q) return
  router.push({ path: '/search', query: { q } })
  searchInput.value = ''
}

const reportSubItems = [
  { label: 'Moby Read 리포트', to: '/reports/mobyread' },
  { label: 'Ecc Progress 리포트', to: '/reports/ecc-progress' },
  { label: 'Online Scores 리포트', to: '/reports/online-scores' },
  { label: 'RSA 리포트', to: '/reports/rsa' },
  { label: 'YEPT 리포트', to: '/reports/yept' },
]

const isReportActive = computed(() => route.path.startsWith('/reports'))

watch(isReportActive, (val) => {
  if (val) reportsOpen.value = true
}, { immediate: true })

const navItems = [
  { label: 'AI 리포트 상담', icon: 'i-lucide-message-circle', to: '/consults' },
  { label: '설정', icon: 'i-lucide-settings', to: '/settings' }
]

function logout() {
  localStorage.removeItem('auth_token')
  router.push('/login')
}

const userMenuItems = [[
  {
    label: '로그아웃',
    icon: 'i-lucide-log-out',
    onSelect: logout
  }
]]

// 모바일에서 메뉴 클릭 시 사이드바 닫기
function handleNavClick() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

    <!-- 모바일 오버레이 -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
      <aside
        v-show="sidebarOpen || true"
        :class="[
          'fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0 flex flex-col',
          'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
          'transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- 로고 -->
        <div class="flex items-center gap-3 px-5 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-book-open" class="w-4 h-4 text-white" />
          </div>
          <span class="font-semibold text-sm text-gray-900 dark:text-white leading-tight">YBM AI Report</span>
        </div>

        <!-- 네비게이션 -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <!-- 대시보드 -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
            :class="route.path === '/'
              ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
            @click="handleNavClick"
          >
            <UIcon
              name="i-lucide-layout-dashboard"
              class="w-5 h-5 flex-shrink-0"
              :class="route.path === '/'
                ? 'text-primary-500'
                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'"
            />
            대시보드
          </NuxtLink>

          <!-- 리포트 (서브메뉴) -->
          <div>
            <button
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
              :class="isReportActive
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
              @click="reportsOpen = !reportsOpen"
            >
              <UIcon
                name="i-lucide-file-bar-chart"
                class="w-5 h-5 flex-shrink-0"
                :class="isReportActive
                  ? 'text-primary-500'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'"
              />
              <span class="flex-1 text-left">리포트</span>
              <UIcon
                :name="reportsOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="w-4 h-4 flex-shrink-0 text-gray-400"
              />
            </button>
            <div v-if="reportsOpen" class="mt-1 ml-4 space-y-0.5">
              <NuxtLink
                v-for="sub in reportSubItems"
                :key="sub.to"
                :to="sub.to"
                class="flex items-center gap-2 pl-4 pr-3 py-2 rounded-lg text-sm transition-colors"
                :class="route.path === sub.to
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
                @click="handleNavClick"
              >
                {{ sub.label }}
              </NuxtLink>
            </div>
          </div>

          <!-- 나머지 메뉴 -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
            :class="route.path === item.to
              ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
            @click="handleNavClick"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5 flex-shrink-0"
              :class="route.path === item.to
                ? 'text-primary-500'
                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'"
            />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- 사이드바 하단 유저 정보 -->
        <div class="px-3 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg">
            <UAvatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Admin"
              size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">관리자</p>
              <p class="text-xs text-gray-500 truncate">admin@mobyread.ai</p>
            </div>
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-log-out"
              size="sm"
              @click="logout"
            />
          </div>
        </div>
      </aside>
    </Transition>

    <!-- 메인 영역 -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 헤더 -->
      <header class="h-16 flex-shrink-0 flex items-center gap-3 px-4 lg:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <!-- 햄버거 버튼 (모바일) -->
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          class="lg:hidden flex-shrink-0"
          @click="sidebarOpen = !sidebarOpen"
        />

        <!-- 검색박스 -->
        <form class="flex-1 max-w-sm" @submit.prevent="goSearch">
          <UInput
            v-model="searchInput"
            placeholder="학생 이름 검색..."
            icon="i-lucide-search"
            class="w-full"
            @keydown.enter="goSearch"
          />
        </form>

        <div class="flex items-center gap-2 ml-auto flex-shrink-0">
          <UColorModeButton />
          <UDropdownMenu :items="userMenuItems">
            <UButton variant="ghost" color="neutral" class="flex items-center gap-2 px-2">
              <UAvatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                alt="Admin"
                size="sm"
              />
              <span class="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">관리자</span>
              <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-400" />
            </UButton>
          </UDropdownMenu>
        </div>
      </header>

      <!-- 페이지 콘텐츠 -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
