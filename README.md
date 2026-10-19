# RabbYT Android Download Page

RabbYT Android APK 직접 다운로드, 앱 소개, 사용설명용 정적 페이지입니다.

## Local preview

브라우저에서 `index.html`을 열면 바로 확인할 수 있습니다.

## Deploy

이 저장소는 [Vercel](https://vercel.com/) 정적 사이트 + Serverless Function 배포를 기준으로 구성되어 있습니다.

- 정적 페이지: `index.html`, `styles.css`, `script.js`, `assets/`
- 최신 APK redirect: `api/latest-apk.js`
- Vercel 설정: `vercel.json`

Vercel 배포 후 `https://배포도메인/api/latest-apk`는 GitHub Releases API에서 최신 정식 RabbYT APK를 찾아 해당 asset으로 `302` redirect합니다.

## APK distribution

정식 APK·ZIP은 `hojin-v/RabbYT-download`의 GitHub Releases에 배포합니다. 앱 소스 저장소 `hojin-v/RabbYT`의 정식 릴리즈와 파일·제목·배포 설명이 같고, APK·ZIP의 SHA-256도 일치하도록 검증합니다. APK는 Git 소스 이력에 넣지 않습니다.

베타는 앱 소스 저장소에서만 배포합니다. 공개 릴리즈 태그는 이 다운로드 페이지의 커밋을 가리키며 앱 소스 커밋을 복사하지 않습니다.

정식 릴리즈로 인정하는 조건은 Android 앱 내부 업데이트 정책과 동일합니다.

- `draft`가 아님
- `prerelease`가 아님
- 태그가 `v1.2.3` 형식
- 태그/릴리즈명/asset 이름에 `nightly`, `alpha`, `beta`, `rc`, `dev`, `preview`가 없음
- APK asset 이름이 `RabbYT-Android-vX.Y.Z.apk` 형식

페이지와 `/api/latest-apk`는 공개 배포 저장소를 우선 조회합니다. 이전 중 공개 릴리즈가 아직 없으면 `RabbYT`, `YTET-Android`의 공개 릴리즈를 임시 대체 주소로 확인합니다. 소스 비공개 전환 후에도 공개 저장소의 정식 APK를 받을 수 있습니다. 모든 조회가 실패하면 정식 릴리즈 목록으로 이동하며, 오래된 고정 버전으로 돌아가지 않습니다.

검증: `node --test tests/releases.test.js`

## Assets

- `assets/RabbYT_logo_embedded.svg`: 원본 RabbYT 로고 SVG
- `assets/rabbyt-og-image.png`: 원본 로고를 활용한 링크 공유용 PNG
- `assets/rabbyt-og-image-20260620.png`: 카카오톡 등 링크 미리보기 캐시 갱신용 버전 PNG
- `assets/rabbyt-share-logo-thumbnail-20260620.png`: 카카오톡에서 중앙 로고형으로 보이도록 고정한 링크 공유용 PNG
- `assets/rabbyt-og-image.svg`: 원본 로고를 활용한 링크 공유용 SVG 원본
- `assets/rabbyt-mask-icon.svg`: 원본 로고를 활용한 브라우저 mask icon SVG
- `assets/lauv-cover.jpg`: Lauv `26` 예시 커버 이미지
- `assets/youtube-playlist-lauv.png`: Lauv YouTube 플레이리스트 화면 캡처
- `assets/stream-essential-*.jpg`: essential; 스트림 목업용 YouTube 썸네일
- `assets/stream-layback-*.jpg`: 레이백 스트림 목업용 YouTube 썸네일

사용설명은 두 부분으로 구성됩니다.

- 설치 안내: APK 다운로드 후 Android 설치 화면에서 승인하는 과정을 고정 단계로 안내합니다.
- 앱 사용법: HTML/CSS/JS로 만든 스마트폰 목업을 단계별 카드로 보여주며 스트림, 내 음악, 추출기 흐름을 설명합니다.
