// 전체 학생 마스터 데이터
export interface Student {
  id: number
  name: string
  nickname: string
  dob: string
  academy: string
  curriculum: string
  day: string
  level: string
}

// ECC Progress 평가 레코드
export interface EccRecord {
  studentId: number
  eval: string
  confirmed: boolean
}

// Online Scores 레코드
export interface OnlineRecord {
  studentId: number
  daily: (number | null)[]
  logical: (number | null)[]
  jet: number | null
  iseed: number
}

// RSA 레코드
export interface RsaRecord {
  studentId: number
  cohort: string
  year: string
  class: string
  teacher: string
  score: number
  date: string
}

// YEPT 레코드
export interface YeptRecord {
  studentId: number
  level: string
  datetime: string
  status: '완료' | '대기' | '취소'
  assignedLevel: string
}

export const students: Student[] = [
  { id: 1,  name: '김*린', nickname: 'Aileen',  dob: '1908**', academy: '모비리드 강남점', curriculum: 'Ivy Master',              day: '월화수목금(MTWThF)', level: 'CA 3B' },
  { id: 2,  name: '박*연', nickname: 'Ella',    dob: '1905**', academy: '모비리드 강남점', curriculum: 'Ivy Master',              day: '월화수목금(MTWThF)', level: 'PG 6B' },
  { id: 3,  name: '이*윤', nickname: 'Peter',   dob: '1908**', academy: '모비리드 서초점', curriculum: 'Ivy Master',              day: '월화수목금(MTWThF)', level: 'PG 5B' },
  { id: 4,  name: '이*이', nickname: '',        dob: '1906**', academy: '모비리드 서초점', curriculum: 'Ivy Master',              day: '월화수목금(MTWThF)', level: 'CA 3B' },
  { id: 5,  name: '정*우', nickname: 'Bella',   dob: '1908**', academy: '모비리드 송파점', curriculum: 'Elementary (초등회화반)', day: '월수금(MWF)',        level: 'PG 4A' },
  { id: 6,  name: '정*원', nickname: 'Jenny',   dob: '1906**', academy: '모비리드 송파점', curriculum: 'Elementary (초등회화반)', day: '월수금(MWF)',        level: 'PG 4A' },
  { id: 7,  name: '허*우', nickname: 'Lucas.H', dob: '1912**', academy: '모비리드 강동점', curriculum: 'ONE TO ONE',              day: '화목(TTh)',          level: 'CA 2A' },
  { id: 8,  name: '허*빈', nickname: 'Belle',   dob: '1912**', academy: '모비리드 강동점', curriculum: 'ONE TO ONE',              day: '화목(TTh)',          level: 'CA 2A' },
  { id: 9,  name: '강*준', nickname: 'Ethan',   dob: '1910**', academy: '모비리드 마포점', curriculum: '단과',                    day: '화목(TTh)',          level: 'PG 3B' },
  { id: 10, name: '윤*서', nickname: 'Sophia',  dob: '1911**', academy: '모비리드 마포점', curriculum: '방학특강',                day: '월화수목금(MTWThF)', level: 'CA 1A' },
]

export const eccRecords: EccRecord[] = [
  { studentId: 1,  eval: '-', confirmed: true },
  { studentId: 2,  eval: '-', confirmed: true },
  { studentId: 3,  eval: '-', confirmed: true },
  { studentId: 4,  eval: '-', confirmed: true },
  { studentId: 5,  eval: '-', confirmed: false },
  { studentId: 6,  eval: '-', confirmed: true },
  { studentId: 7,  eval: '-', confirmed: true },
  { studentId: 8,  eval: '-', confirmed: false },
  { studentId: 9,  eval: '-', confirmed: true },
  { studentId: 10, eval: '-', confirmed: false },
]

export const onlineRecords: OnlineRecord[] = [
  { studentId: 1,  daily: [null, null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 0 },
  { studentId: 2,  daily: [null, null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 0 },
  { studentId: 3,  daily: [97,   null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 117 },
  { studentId: 4,  daily: [91,   null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 111 },
  { studentId: 5,  daily: [91,   81,   null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 212 },
  { studentId: 6,  daily: [87,   86,   null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 213 },
  { studentId: 7,  daily: [null, null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 0 },
  { studentId: 8,  daily: [null, null, null, null, null, null, null, null, null, null, null, null], logical: [null, null, null, null], jet: null, iseed: 0 },
]

export const rsaRecords: RsaRecord[] = [
  { studentId: 1,  cohort: '3기', year: '2연차', class: 'A반', teacher: '이지은', score: 85, date: '2026.01.10' },
  { studentId: 2,  cohort: '3기', year: '2연차', class: 'B반', teacher: '최현우', score: 92, date: '2026.01.11' },
  { studentId: 3,  cohort: '3기', year: '2연차', class: 'A반', teacher: '이지은', score: 78, date: '2026.01.12' },
  { studentId: 4,  cohort: '3기', year: '2연차', class: 'C반', teacher: '김태양', score: 88, date: '2026.01.13' },
  { studentId: 5,  cohort: '3기', year: '2연차', class: 'B반', teacher: '최현우', score: 95, date: '2026.01.14' },
  { studentId: 6,  cohort: '3기', year: '2연차', class: 'A반', teacher: '이지은', score: 72, date: '2026.01.15' },
  { studentId: 7,  cohort: '3기', year: '2연차', class: 'C반', teacher: '김태양', score: 81, date: '2026.01.16' },
  { studentId: 8,  cohort: '3기', year: '2연차', class: 'B반', teacher: '최현우', score: 90, date: '2026.01.17' },
  { studentId: 9,  cohort: '3기', year: '2연차', class: 'A반', teacher: '이지은', score: 67, date: '2026.01.18' },
  { studentId: 10, cohort: '3기', year: '2연차', class: 'C반', teacher: '김태양', score: 84, date: '2026.01.19' },
]

export const yeptRecords: YeptRecord[] = [
  { studentId: 1,  level: 'Level 3', datetime: '2026.04.05 10:00', status: '완료', assignedLevel: 'CA 3B' },
  { studentId: 2,  level: 'Level 5', datetime: '2026.04.05 10:30', status: '완료', assignedLevel: 'PG 6B' },
  { studentId: 3,  level: 'Level 4', datetime: '2026.04.06 11:00', status: '완료', assignedLevel: 'PG 5B' },
  { studentId: 4,  level: 'Level 3', datetime: '2026.04.06 11:30', status: '완료', assignedLevel: 'CA 3B' },
  { studentId: 5,  level: 'Level 2', datetime: '2026.04.07 14:00', status: '대기', assignedLevel: '-' },
  { studentId: 6,  level: 'Level 2', datetime: '2026.04.07 14:30', status: '완료', assignedLevel: 'PG 4A' },
  { studentId: 7,  level: 'Level 1', datetime: '2026.04.08 10:00', status: '완료', assignedLevel: 'CA 2A' },
  { studentId: 8,  level: 'Level 1', datetime: '2026.04.08 10:30', status: '취소', assignedLevel: '-' },
  { studentId: 9,  level: 'Level 3', datetime: '2026.04.09 13:00', status: '완료', assignedLevel: 'PG 3B' },
  { studentId: 10, level: 'Level 1', datetime: '2026.04.09 13:30', status: '대기', assignedLevel: '-' },
]

export function useStudentData() {
  function getStudent(id: number) {
    return students.find(s => s.id === id) ?? null
  }

  function getEcc(studentId: number) {
    return eccRecords.find(r => r.studentId === studentId) ?? null
  }

  function getOnline(studentId: number) {
    return onlineRecords.find(r => r.studentId === studentId) ?? null
  }

  function getRsa(studentId: number) {
    return rsaRecords.find(r => r.studentId === studentId) ?? null
  }

  function getYept(studentId: number) {
    return yeptRecords.find(r => r.studentId === studentId) ?? null
  }

  function searchStudents(query: string) {
    if (!query.trim()) return students
    const q = query.trim().toLowerCase()
    return students.filter(s =>
      s.name.includes(q) ||
      s.nickname.toLowerCase().includes(q) ||
      s.academy.includes(q)
    )
  }

  // 학생의 모든 리포트를 통합해서 반환
  function getStudentReports(studentId: number) {
    return {
      student: getStudent(studentId),
      ecc: getEcc(studentId),
      online: getOnline(studentId),
      rsa: getRsa(studentId),
      yept: getYept(studentId),
    }
  }

  // 데이터 기반 AI 분석 텍스트 생성
  function generateAiAnalysis(studentId: number) {
    const { student, online, rsa, yept } = getStudentReports(studentId)
    if (!student) return null

    const rsaScore = rsa?.score ?? null
    const yeptDone = yept?.status === '완료'
    const dailyScores = online?.daily.filter(s => s !== null) as number[] ?? []
    const avgDaily = dailyScores.length
      ? Math.round(dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length)
      : null

    const strengths: string[] = []
    const improvements: string[] = []

    if (rsaScore !== null && rsaScore >= 85) {
      strengths.push(`RSA 시험에서 ${rsaScore}점을 기록하며 우수한 성취도를 보였습니다.`)
    } else if (rsaScore !== null) {
      improvements.push(`RSA 점수(${rsaScore}점) 향상을 위한 집중 학습이 필요합니다.`)
    }

    if (avgDaily !== null && avgDaily >= 88) {
      strengths.push(`Daily Home Study 평균 ${avgDaily}점으로 꾸준한 자기 주도 학습을 실천하고 있습니다.`)
    } else if (avgDaily !== null) {
      improvements.push(`Daily Home Study 평균 ${avgDaily}점으로 복습 루틴 강화가 필요합니다.`)
    }

    if (yeptDone && yept?.assignedLevel) {
      strengths.push(`YEPT 레벨 테스트 결과 ${yept.assignedLevel}으로 배정되어 현재 수준이 확인되었습니다.`)
    }

    if (online?.iseed && online.iseed > 100) {
      strengths.push(`iSeed ${online.iseed}점으로 온라인 학습 참여도가 높습니다.`)
    }

    if (strengths.length === 0) {
      strengths.push('수업 참여 태도가 안정적으로 유지되고 있습니다.')
    }
    if (improvements.length === 0) {
      improvements.push('현재 수준을 유지하면서 다음 레벨 진급을 위한 준비를 시작하는 것을 권장합니다.')
    }

    const recommendation = `${student.name} 학생은 ${student.curriculum} 과정 ${student.level} 레벨에서 수강 중이며, 수집된 리포트 데이터를 종합할 때 전반적으로 ${rsaScore && rsaScore >= 80 ? '양호한' : '성장 가능성 있는'} 학습 흐름을 보이고 있습니다. 학부모님께서는 가정에서의 복습 환경 조성에 관심을 가져주시고, 다음 상담 시까지 ${improvements[0]?.replace('필요합니다.', '노력해 주시기 바랍니다.')}`

    return { strengths, improvements, recommendation }
  }

  return {
    students,
    eccRecords,
    onlineRecords,
    rsaRecords,
    yeptRecords,
    searchStudents,
    getStudent,
    getStudentReports,
    generateAiAnalysis,
  }
}
