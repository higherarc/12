# To-Do 앱

Next.js로 만든 협업형 To-Do 관리 앱입니다.

## ✨ 주요 기능

- 📝 빠른 작업 생성 및 관리
- 👥 다중 담당자 지정
- 📅 오늘 할 일 관리
- 🔄 반복 업무 설정 (매일/평일/매주/매월)
- 🏷️ 카테고리별 분류
- 🔍 검색 및 필터링
- ✅ 완료 아카이브

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **UI**: Lucide React Icons

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## 📱 사용법

1. **새 작업 추가**: 우상단 "새 작업" 버튼 클릭
2. **오늘 할 일**: 작업에서 달력 아이콘으로 설정
3. **담당자 지정**: 작업 생성/수정 시 다중 선택
4. **반복 설정**: 매일, 평일, 매주, 매월 반복 가능
5. **카테고리**: 좌측 사이드바에서 관리
6. **검색**: 상단 검색창으로 작업 찾기

## 🎯 타겟 사용자

- 개인 창업자/프리랜서
- 2-5인 소규모 팀
- 가정 내 공동 업무 관리

## 📊 성공 지표

- 평균 Task 생성 시간 5초 이하
- Today 탭 체류율/완료율
- 다인 담당 Task 사용 비율
- 반복 Task 자동 생성 성공률 100%
