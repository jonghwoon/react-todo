# 1단계: 노드 환경에서 React 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json* ./
RUN npm install

# 소스 코드 복사 및 프로덕션 빌드 실행
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# 2단계: Nginx를 통한 정적 파일 서빙
FROM nginx:alpine

# 기존 Nginx 기본 HTML 파일 삭제
RUN rm -rf /usr/share/nginx/html/*

# 1단계에서 빌드된 결과물만 Nginx 서빙 폴더로 복사
# ⚠️ 주의: CRA는 'build', Vite는 'dist' 폴더를 생성합니다.
# 현재 CRA 프로젝트이므로 아래는 build로 설정되어 있습니다. Vite 적용 시 dist로 변경하세요.
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트 노출
EXPOSE 80

# Nginx 백그라운드 실행
CMD ["nginx", "-g", "daemon off;"]