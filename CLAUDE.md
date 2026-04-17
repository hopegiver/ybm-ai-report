# 프로젝트 규칙

## 스택
- Nuxt 4 (latest) + Nuxt UI 4 (latest, @nuxt/ui v4.x)
- Tailwind CSS v4
- Cloudflare Pages 배포 (SPA, ssr: false)
- pnpm 패키지 매니저

## Nuxt UI 4 핵심 API 규칙

### UTable
- columns 형식: `{ accessorKey: string, header: string }` — `key`/`label` 사용 금지
- cell 슬롯: `#${accessorKey}-cell="{ row }"` — row 데이터는 반드시 `row.original.xxx`로 접근
- header 슬롯: `#${accessorKey}-header="{ header }"`
- 행 클릭: `:on-select="fn"` (prop)

### UDropdownMenu
- 아이템 핸들러: `onSelect: fn` — `click` 또는 `onClick` 사용 금지
- 아이템 구분선: `{ type: 'separator' }`
- 아이템 라벨: `{ type: 'label', label: '...' }`
- 그룹: `items` prop에 `Array<Array>` 형식으로 전달

### UNavigationMenu
- 아이템: `{ label, icon, to, onSelect }` 형식
- 수직 메뉴: `:orientation="'vertical'"`

### UFormField
- props: `label`, `name`, `description`, `hint`, `error`, `required`
- 슬롯: `#default="{ error }"` — 내부 input에 error 전달됨

### USelect
- items: 문자열 배열 또는 `{ label, value }` 객체 배열
- v-model로 선택값 바인딩

### UButton
- 클릭: `@click` 또는 `:on-click="fn"` 둘 다 가능
- 링크: `to` prop (NuxtLink), `href` prop (외부)
- 로딩: `:loading="bool"`, `loading-auto` (async 자동)

### 공통 color 값
- `'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'`

### 공통 variant 값
- `'solid' | 'outline' | 'soft' | 'ghost' | 'link' | 'subtle'`

## 개발 서버 실행
```bash
./node_modules/.bin/nuxt dev
```
(pnpm dev는 PATH 문제로 동작 안 할 수 있음)

## 인증
- localStorage `auth_token` 키로 mock 토큰 저장
- 테스트 계정: `admin@mobyread.ai` / `admin1234`
- middleware/auth.ts에서 클라이언트 사이드 가드 처리
