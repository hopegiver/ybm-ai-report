export type ConsultStatus = '대기' | '진행중' | '완료'

export interface Consult {
  id: string
  studentId: number
  studentName: string
  academy: string
  curriculum: string
  level: string
  consultant: string
  createdAt: string       // ISO string
  scheduledAt: string     // 상담 예정일 (YYYY-MM-DD)
  completedAt: string | null
  status: ConsultStatus
  memo: string
  shareToken: string
}

const STORAGE_KEY = 'mobyread_consults'

function loadFromStorage(): Consult[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(list: Consult[]) {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function generateToken(id: string) {
  // 간단한 공유 토큰: btoa(id) 기반
  return btoa(id).replace(/=/g, '')
}

export function useConsults() {
  const consults = ref<Consult[]>([])

  function load() {
    consults.value = loadFromStorage()
  }

  function create(data: Omit<Consult, 'id' | 'createdAt' | 'completedAt' | 'status' | 'memo' | 'shareToken'>): Consult {
    const id = generateId()
    const consult: Consult = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: '대기',
      memo: '',
      shareToken: generateToken(id),
    }
    consults.value.unshift(consult)
    saveToStorage(consults.value)
    return consult
  }

  function update(id: string, patch: Partial<Consult>) {
    const idx = consults.value.findIndex(c => c.id === id)
    if (idx < 0) return
    consults.value[idx] = { ...consults.value[idx], ...patch }
    saveToStorage(consults.value)
  }

  function complete(id: string, memo: string) {
    update(id, {
      status: '완료',
      memo,
      completedAt: new Date().toISOString(),
    })
  }

  function startConsult(id: string) {
    update(id, { status: '진행중' })
  }

  function remove(id: string) {
    consults.value = consults.value.filter(c => c.id !== id)
    saveToStorage(consults.value)
  }

  function getById(id: string) {
    return consults.value.find(c => c.id === id) ?? null
  }

  function getByToken(token: string) {
    return consults.value.find(c => c.shareToken === token) ?? null
  }

  // 컴포넌트 마운트 시 자동 로드
  onMounted(load)

  return {
    consults,
    load,
    create,
    update,
    complete,
    startConsult,
    remove,
    getById,
    getByToken,
  }
}
