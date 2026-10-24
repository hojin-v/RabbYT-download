const guideStack = document.querySelector("[data-guide-stack]");
const heroTabs = document.querySelectorAll("[data-hero-tab]");
const heroPhones = document.querySelectorAll("[data-hero-phone]");
const siteHeader = document.querySelector(".site-header");
const latestApkLinks = document.querySelectorAll("[data-latest-apk-link]");
const releaseStatus = document.querySelector("[data-release-status]");
const releaseVersion = document.querySelector("[data-release-version]");
const releaseSize = document.querySelector("[data-release-size]");
const apkName = document.querySelector("[data-apk-name]");
const releaseNotesLinks = document.querySelectorAll("[data-release-notes-link]");

const releasesApiUrl = "https://api.github.com/repos/hojin-v/RabbYT-download/releases?per_page=30";
const releasesApiUrls = [releasesApiUrl,
  "https://api.github.com/repos/hojin-v/RabbYT/releases?per_page=30",
  "https://api.github.com/repos/hojin-v/YTET-Android/releases?per_page=30"];
const releasesPageUrl = "https://github.com/hojin-v/RabbYT-download/releases";
const stableTagPattern = /^v(\d+)\.(\d+)\.(\d+)$/;
const stableApkPattern = /^RabbYT-Android-v\d+\.\d+\.\d+\.apk$/i;
const unstableMarkerPattern = /(^|[^a-z0-9])(nightly|alpha|beta|rc|dev|preview)([^a-z0-9]|$)/i;

const tabLabels = {
  stream: "스트림",
  library: "내 음악",
  extractor: "추출기",
  youtube: "YouTube 탐색",
  video: "영상 플레이어",
};

const guideData = {
  stream: {
    title: "스트림",
    text: "취향에 맞는 채널을 모으고, 플레이리스트형 영상을 음악처럼 이어 듣는 화면입니다.",
    active: "stream-playlists",
    points: [
      ["채널 관리", "편집에서 채널을 검색해 미리 확인하고 추가·삭제·순서 변경합니다. 기본 채널도 지울 수 있습니다."],
      ["영상 찾기", "상단 YouTube 버튼을 누르면 앱 안의 영상 검색 화면으로 전환합니다."],
      ["하단 플레이어", "재생 상태는 앱 아래 미니 플레이어에서 계속 확인합니다."],
    ],
    details: {
      "stream-playlists": {
        title: "내 취향으로 채널을 고르고 이어 듣기",
        text: "기본 채널로 시작하고, 자주 듣는 채널은 직접 추가하세요. 음악처럼 들을 때와 영상으로 볼 때의 플레이어를 나눴습니다.",
        points: [
          ["채널 편집", "검색한 채널의 이미지와 최근 영상을 확인하고 추가합니다. 순서도 바꿀 수 있습니다."],
          ["채널 상세", "최신순·인기순·날짜순·좋아요와 보기 형식으로 찾고 다음 목록을 이어 불러옵니다."],
          ["재생과 공유", "스트림은 음악 플레이어로 듣고, 항목을 길게 누르면 링크를 복사하거나 공유합니다."],
        ],
      },
    },
  },
  youtube: {
    title: "YouTube 탐색", text: "스트림 상단의 YouTube 버튼에서 영상·Shorts·채널·재생목록을 찾습니다.", active: "youtube-search",
    points: [
      ["검색과 보기", "전체·동영상·Shorts를 고르고 목록·작은 카드·큰 카드로 전환합니다. 아래로 내리면 다음 결과를 불러옵니다."],
      ["로그인하면", "열쇠 버튼에서 YouTube 로그인 정보를 연결하면 맞춤 추천·구독과 저장된 재생목록을 볼 수 있습니다."],
      ["재생목록", "목록을 열어 수록 영상을 확인하고 선택한 영상부터 순서대로 재생합니다. 길게 누르면 원본 링크를 공유합니다."],
    ], details: {},
  },
  video: {
    title: "전용 영상 플레이어", text: "YouTube 탐색에서 고른 영상은 전용 플레이어로 열립니다. 앱을 나가거나 작은 창으로 바꿔도 이어집니다.", active: "video-controls",
    points: [
      ["재생 설정", "화질·음성·자막·배속, 다음 영상 자동재생과 종료 타이머를 설정합니다. 한국어 음성이 있으면 우선 선택합니다."],
      ["화면 조작", "양끝 더블 탭으로 10초 이동합니다. 조작 버튼이 숨겨진 화면의 왼쪽·오른쪽 가장자리를 밀어 밝기·음량을 바꾸고 두 손가락으로 확대합니다."],
      ["앱 밖에서도", "백그라운드·잠금화면·PiP에서 재생하고 하단 플레이어바로 돌아옵니다. 회전 잠금과 제스처 잠금은 따로 설정합니다."],
    ], details: {},
  },
  library: {
    title: "기기 플레이어",
    text: "기기에 저장된 음악을 스캔해 찾고, 정리하고, 앱 안에서 재생하는 화면입니다.",
    active: "library-player",
    points: [
      ["음악 목록", "커버 이미지, 제목, 아티스트, 앨범 정보를 목록에서 바로 확인합니다."],
      ["분류와 검색", "전체, 앨범, 아티스트, 재생목록 기준으로 음악을 찾습니다."],
      ["앱 내 재생", "선택한 음악은 하단 플레이어와 확장 플레이어에서 재생합니다."],
    ],
    details: {
      "library-filters": {
        title: "보관함 필터",
        text: "필터 칩을 눌러 같은 음악 목록을 다른 기준으로 볼 수 있습니다.",
        points: [
          ["소스 선택", "보관함·기기 파일을 고릅니다. YouTube 로그인 상태이면 계정의 저장된 재생목록도 별도로 볼 수 있습니다."],
          ["앨범/아티스트", "파일 메타데이터를 기준으로 음악을 묶습니다."],
          ["재생목록", "직접 만든 묶음으로 음악을 관리합니다."],
        ],
      },
      "library-actions": {
        title: "검색과 보기",
        text: "상단 우측의 검색/보기 아이콘으로 음악을 찾거나 보기 방식을 바꿀 수 있습니다.",
        points: [
          ["검색", "우측 검색 아이콘으로 제목, 아티스트, 앨범 기준 검색을 시작합니다."],
          ["보기 전환", "검색 옆 보기 아이콘으로 목록형과 카드형을 전환합니다."],
          ["정렬", "최신순, 이름순, 재생 횟수 기준으로 정렬할 수 있습니다."],
        ],
      },
      "library-player": {
        title: "기기 음악 재생",
        text: "기기 파일을 선택하면 앱 내부 플레이어에서 이어서 재생할 수 있습니다.",
        points: [
          ["하단 플레이어", "현재 곡은 화면 아래에서 계속 표시됩니다."],
          ["배속과 타이머", "배속은 0.1 단위로 바꿉니다. 타이머의 남은 시간과 일시정지·해제는 알림에서도 조작합니다."],
          ["알림 제어", "앱을 벗어나도 재생하며 Android 알림과 잠금화면에서 이전·재생·다음을 조작합니다."],
        ],
      },
      "library-playlists": {
        title: "좋아요와 내 재생목록",
        text: "마음에 든 음악·동영상·플레이리스트를 각각 모으고, 내 음악은 원하는 곡끼리 묶습니다.",
        points: [
          ["좋아요", "플레이어의 하트로 저장합니다. 음악·동영상·플레이리스트는 별도 좋아요 목록으로 정리됩니다."],
          ["목록 만들기", "재생목록 탭의 + 버튼으로 만듭니다. 곡을 길게 눌러 다음 곡 재생·현재 목록 추가·재생목록 저장을 고릅니다."],
          ["파일은 그대로", "재생목록의 곡을 제거해도 파일은 삭제하지 않습니다. 보관함·기기 파일을 바꿔도 같은 목록을 사용합니다."],
        ],
      },
    },
  },
  extractor: {
    title: "추출기",
    text: "YouTube와 기타 지원 사이트의 링크에서 영상·음원·사진을 저장하는 화면입니다.",
    active: "extract-url",
    points: [
      ["URL 입력", "링크를 공유하거나 붙여넣습니다. YouTube와 기타 사이트 모드를 구분합니다."],
      ["옵션 선택", "음원·영상·사진 종류와 포맷을 선택합니다. Other URL은 링크를 분석한 뒤 실제 제공되는 옵션을 표시합니다."],
      ["추출 시작", "저장 폴더를 확인하고 추출 버튼을 누릅니다."],
    ],
    details: {
      "extract-url": {
        title: "YouTube URL",
        text: "추출할 링크를 가장 먼저 입력합니다.",
        points: [
          ["지원 링크", "YouTube·YouTube Music은 기본 모드, Instagram·Threads·X 등 기타 지원 사이트는 Other URL을 사용합니다."],
          ["공유 연동", "다른 앱에서 공유한 링크가 있으면 추출기에 자동 입력됩니다."],
          ["권한 확인", "저장 권한이 있는 콘텐츠만 사용해야 합니다."],
        ],
      },
      "extract-mode-audio": {
        title: "음원 모드",
        text: "음원 저장을 선택하면 플레이리스트 처리와 실제 제목/아티스트 보정 옵션을 함께 설정합니다.",
        points: [
          ["저장 형식", "M4A (AAC) 권장, Opus 원본, MP3를 고릅니다. 기타 사이트는 분석한 원본과 호환 형식이 표시됩니다."],
          ["플레이리스트 처리", "list=가 포함된 YouTube 재생목록 링크를 통째로 저장할 수 있습니다."],
          ["메타데이터 보정", "MusicBrainz 검색 결과로 제목, 아티스트, 앨범 정보를 보정합니다."],
        ],
      },
      "extract-mode-video": {
        title: "영상 모드",
        text: "영상 저장을 선택하면 품질·음성 언어·자막 포함 여부를 설정합니다.",
        points: [
          ["저장 품질", "원본 최고품질 MKV 또는 1080p/720p/480p MP4 옵션을 고릅니다."],
          ["음성 선택", "제공되는 음성 언어를 여러 개 넣거나, 모두 해제해 음성 없이 저장할 수 있습니다."],
          ["자막 옵션", "한국어·영어 등록 자막을 우선하고 없으면 제공되는 자동 생성·번역 자막을 시도합니다."],
        ],
      },
      "extract-playlist": {
        title: "전체 플레이리스트 추출",
        text: "YouTube URL에 list= 값이 포함된 재생목록 링크를 통째로 저장할 때 쓰는 음원 옵션입니다.",
        example: {
          url: "youtube.com/watch?v=6Yf4tPL6_Xw&list=PLxA687tYuMWg_uIXlHU5lAOH11-QDw0OP",
          image: "assets/youtube-playlist-lauv.png",
          caption: "Lauv - All 4 Nothing (Full Album) 플레이리스트 화면",
        },
        points: [
          ["URL 형태", "예: youtube.com/watch?v=6Yf4tPL6_Xw&list=PLxA... 처럼 list=가 붙은 링크입니다."],
          ["개별 영상과 차이", "일반 영상 URL은 한 곡만 저장하고, list= URL은 재생목록 항목을 이어서 처리합니다."],
          ["파일 정리", "저장 시 재생목록 폴더와 번호가 있는 파일명으로 정리됩니다."],
        ],
      },
      "extract-metadata": {
        title: "실제 제목/아티스트 보정",
        text: "YouTube 제목만 믿지 않고 MusicBrainz의 녹음/앨범 정보를 검색해 음악 메타데이터를 더 정확하게 맞춥니다.",
        points: [
          ["활용 데이터", "MusicBrainz API의 recording, release, track 정보를 사용합니다."],
          ["대조 방식", "제목 후보, 아티스트 후보, 앨범명, 재생 길이를 비교해 충분히 비슷한 결과만 적용합니다."],
          ["보정 항목", "제목, 아티스트, 앨범, 앨범 아티스트, 발매일, 트랙 번호를 가능한 범위에서 채웁니다."],
        ],
      },
      "extract-subtitles": {
        title: "영상 자막 옵션",
        text: "한국어·영어 자막을 영상과 함께 저장할지 선택합니다. 포함 여부와 실패 안내도 결과에서 확인합니다.",
        points: [
          ["표시 조건", "자막 옵션은 영상을 선택했을 때만 화면에 나타납니다."],
          ["선택 순서", "한국어·영어 등록 자막을 먼저 확인하고 없으면 사이트의 자동 생성·번역 자막을 시도합니다."],
          ["저장 결과", "실제로 포함했는지와 자막을 받지 못한 이유를 안내합니다. 사이트가 제공하지 않는 자막은 저장할 수 없습니다."],
        ],
      },
      "extract-folder": {
        title: "저장 폴더",
        text: "기본 저장 위치를 쓰거나 Android 폴더 선택 화면에서 직접 고릅니다.",
        points: [
          ["기본값", "YouTube는 Download/RabbYT/Music·Video, 기타 사이트는 플랫폼·계정·종류·추출일별로 정리합니다."],
          ["사용자 지정", "원하는 폴더를 선택해 결과 파일을 저장합니다."],
          ["다시 기본값", "기본값 버튼으로 언제든 기본 저장 경로로 되돌립니다."],
        ],
      },
      "extract-start": {
        title: "추출 시작",
        text: "설정을 확인한 뒤 추출 버튼을 누르면 백그라운드 작업이 시작됩니다.",
        points: [
          ["작업 대기열", "제목과 링크·진행률을 확인합니다. 다른 링크를 추가하면 순서대로 처리하고 대기 작업도 취소할 수 있습니다."],
          ["실패 재시도", "실패 안내의 재시도 버튼으로 다시 대기열에 넣습니다. 진행 중인 다른 작업은 이어집니다."],
          ["추출 기록", "완료한 기록을 날짜·종류·사이트로 찾고 제목·채널·링크를 검색합니다. 링크 복사와 기록 삭제도 지원합니다."],
        ],
      },
      "extract-other": {
        title: "다른 사이트와 사진 저장",
        text: "Other URL에 링크를 넣고 분석하면 제공되는 미디어와 옵션을 확인할 수 있습니다.",
        points: [
          ["실제 옵션", "Instagram·Threads·X 등 지원 사이트가 제공한 형식과 해상도를 표시합니다. 접근 제한에 따라 로그인 정보가 필요할 수 있습니다."],
          ["사진 선택", "Instagram 사진을 전체 또는 여러 장 골라 저장합니다. 영상 게시물도 제공되는 썸네일이나 첫 장면을 사진으로 저장할 수 있습니다."],
          ["원본과 권장", "원본·JPG·PNG·WebP 중에서 고릅니다. 사이트가 제공하는 파일을 저장하며 업로드 전 촬영 파일을 복원하는 기능은 아닙니다."],
        ],
      },
    },
  },
};

const guideSteps = [
  { screen: "stream", target: "stream-playlists" },
  { screen: "youtube", target: "youtube-search" },
  { screen: "video", target: "video-controls" },
  { screen: "library", target: "library-filters" },
  { screen: "library", target: "library-actions" },
  { screen: "library", target: "library-player" },
  { screen: "library", target: "library-playlists" },
  { screen: "extractor", target: "extract-url" },
  { screen: "extractor", target: "extract-other" },
  { screen: "extractor", target: "extract-mode-audio" },
  { screen: "extractor", target: "extract-playlist" },
  { screen: "extractor", target: "extract-metadata" },
  { screen: "extractor", target: "extract-mode-video" },
  { screen: "extractor", target: "extract-subtitles" },
  { screen: "extractor", target: "extract-folder" },
  { screen: "extractor", target: "extract-start" },
];

function stableParts(tagName) {
  const match = stableTagPattern.exec(String(tagName || "").trim());
  return match ? match.slice(1).map((value) => Number.parseInt(value, 10)) : null;
}

function compareStableTags(left, right) {
  const leftParts = stableParts(left);
  const rightParts = stableParts(right);
  if (!leftParts || !rightParts) {
    return 0;
  }
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
}

function stableApkAsset(release) {
  return (release.assets || []).find((asset) => {
    const name = String(asset.name || "");
    const url = String(asset.browser_download_url || "");
    return stableApkPattern.test(name) && !unstableMarkerPattern.test(name) && url.startsWith("https://");
  });
}

function latestStableRelease(releases) {
  return (Array.isArray(releases) ? releases : [])
    .filter((release) => {
      const tagName = String(release.tag_name || "");
      const releaseName = String(release.name || "");
      return !release.draft
        && !release.prerelease
        && stableTagPattern.test(tagName)
        && !unstableMarkerPattern.test(`${tagName} ${releaseName}`)
        && stableApkAsset(release);
    })
    .sort((left, right) => compareStableTags(right.tag_name, left.tag_name))[0];
}

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) {
    return "확인 중";
  }
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tabsHtml(activeScreen) {
  if (["youtube", "video"].includes(activeScreen)) activeScreen = "stream";
  return `
    <div class="bottom-tabs mock-tabs">
      ${["stream", "library", "extractor"]
        .map((key) => {
          const label = tabLabels[key];
          const activeClass = key === activeScreen ? "active" : "";
          return `<span class="${activeClass}">${label}</span>`;
        })
        .join("")}
    </div>
  `;
}

function channelSectionHtml(channel, rows) {
  return `
    <div class="stream-section">
      <span class="stream-channel">${escapeHtml(channel)}</span>
      ${rows
        .map(
          ([title, meta, cover]) => `
            <span class="stream-row-inline">
              <span class="cover ${cover}"></span>
              <span class="mock-copy">
                <strong>${escapeHtml(title)}</strong>
                <small>${escapeHtml(meta)}</small>
              </span>
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function screenHtml(screenKey, activeTarget) {
  if (screenKey === "youtube") {
    return `<div class="mock-stream-toolbar"><span class="mock-youtube">▶</span><span>로그인 관리</span></div>
      <div class="mock-search">영상·채널·재생목록 검색</div>
      <div class="chip-row"><span class="active">전체</span><span>동영상</span><span>Shorts</span><span>구독</span></div>
      <div class="mock-result-thumb cover stream-essential-1"><span>13:57</span></div>
      <div class="mock-result-copy"><strong>지금, 보고 싶은 영상을 바로</strong><small>essential; · 1.3만회</small></div>
      <div class="mock-video-row"><span class="cover stream-layback-1"></span><div><strong>마음에 드는 플레이리스트</strong><small>레이백 · 재생목록</small></div></div>
      ${tabsHtml(screenKey)}`;
  }
  if (screenKey === "video") {
    return `<div class="video-preview"><img src="assets/stream-essential-1.jpg" alt="" loading="lazy">
      <div class="video-preview-title"><strong>지금, 보고 싶은 영상을 바로</strong><span>essential; · 1.3만회</span></div><span class="video-preview-play">▶</span>
      <div class="video-preview-controls"><span>0:18 / 13:57</span><span>1.0× &nbsp; CC &nbsp; <svg class="mock-fullscreen" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2H2v4m8-4h4v4M2 10v4h4m8-4v4h-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span></div><span class="video-preview-progress"></span></div>
      <div class="mock-setting-row"><span>화질</span><strong>자동 · 1080p</strong></div>
      <div class="mock-setting-row"><span>음성 언어</span><strong>자동 · 한국어</strong></div>
      <div class="mock-setting-row"><span>자막</span><strong>한국어</strong></div>
      <div class="mock-setting-row"><span>종료 타이머</span><strong>동영상 끝</strong></div>
      <div class="mock-setting-row"><span>작은 창으로 이어 보기</span><strong>PiP</strong></div>`;
  }
  if (screenKey === "stream") {
    return `
      <div class="mock-stream-toolbar"><span class="mock-youtube">▶</span><span>편집</span></div>
      ${channelSectionHtml(
        "essential;",
        [
          ["라이즈? 그냥 느껴 | songs picked by RIIZE", "essential; · 21시간 전", "stream-essential-1"],
          ["초여름 날씨는 완전 사랑이지", "essential; · 7일 전", "stream-essential-2"],
          ["이런 R&B 찾고 있었잖아", "essential; · 2주 전", "stream-essential-3"],
        ],
      )}
      ${channelSectionHtml(
        "레이백",
        [
          ["삿포로에서 보내는 눈인사", "레이백 · 3개월 전", "stream-layback-1"],
          ["한여름 시드니 R&B 팝 플리", "레이백 · 3개월 전", "stream-layback-2"],
          ["상수동 레코드샵 트렌디 팝", "레이백 · 4개월 전", "stream-layback-3"],
        ],
      )}
      <div class="mini-track">
        <span class="cover stream-essential-1"></span>
        <span class="mock-copy">
          <strong>RIIZE PIICK</strong>
          <small>재생 중 · essential;</small>
        </span>
        <span class="playing-bars" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>
      ${tabsHtml(screenKey)}
    `;
  }

  if (screenKey === "library") {
    if (activeTarget === "library-playlists") {
      return `<div class="screen-toolbar compact-toolbar"><span class="source-chip">보관함</span><span class="icon-dot" aria-label="검색"></span><span class="icon-grid" aria-label="보기 전환"></span></div>
        <div class="chip-row"><span>전체</span><span>앨범</span><span>아티스트</span><span class="active">재생목록</span></div>
        <div class="library-row"><span class="cover lauv-cover"></span><span class="mock-copy"><strong>좋아요 표시한 음악</strong><small>12곡</small></span></div>
        <div class="library-row"><span class="cover stream-essential-1"></span><span class="mock-copy"><strong>좋아요 표시한 동영상</strong><small>4개 동영상</small></span></div>
        <div class="library-row"><span class="cover stream-layback-1"></span><span class="mock-copy"><strong>좋아요 표시한 플레이리스트</strong><small>3개 플레이리스트</small></span></div>
        <span class="mock-fab" aria-label="새 재생목록">+</span>${tabsHtml(screenKey)}`;
    }
    return `
      <div class="screen-toolbar compact-toolbar">
        <span class="source-chip ${activeTarget === "library-filters" ? "active" : ""}">보관함</span>
        <span class="icon-dot ${activeTarget === "library-actions" ? "active" : ""}" aria-label="검색"></span>
        <span class="icon-grid ${activeTarget === "library-actions" ? "active" : ""}" aria-label="보기 전환"></span>
      </div>
      <div class="chip-row ${activeTarget === "library-filters" ? "active" : ""}">
        <span class="active">전체</span>
        <span>앨범</span>
        <span>아티스트</span>
        <span>재생목록</span>
      </div>
      <div class="library-row">
        <span class="cover lauv-cover"></span>
        <span class="mock-copy">
          <strong>26</strong>
          <small>Lauv · All 4 Nothing</small>
        </span>
      </div>
      <div class="library-row">
        <span class="cover lauv-cover"></span>
        <span class="mock-copy">
          <strong>Stranger</strong>
          <small>Lauv · All 4 Nothing</small>
        </span>
      </div>
      <div class="library-row">
        <span class="cover lauv-cover"></span>
        <span class="mock-copy">
          <strong>Kids Are Born Stars</strong>
          <small>Lauv · All 4 Nothing</small>
        </span>
      </div>
      <div class="mini-track ${activeTarget === "library-player" ? "active" : ""}">
        <span class="cover lauv-cover"></span>
        <span class="mock-copy">
          <strong>26</strong>
          <small>재생 중 · Lauv</small>
        </span>
        <span class="playing-bars" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>
      ${tabsHtml(screenKey)}
    `;
  }

  const isOther = activeTarget === "extract-other";
  const isVideoMode = activeTarget === "extract-mode-video" || activeTarget === "extract-subtitles";
  const isAudioModeStep = activeTarget === "extract-mode-audio";
  const isVideoModeStep = activeTarget === "extract-mode-video";
  const folderPath = isOther ? "Download/RabbYT/Instagram/계정명/image/추출일" : isVideoMode ? "Download/RabbYT/Video" : "Download/RabbYT/Music";

  return `
    <div class="field-label url-modes"><span>YouTube</span><span>|</span><span>Other URL</span></div>
    <div class="input-preview ${activeTarget === "extract-url" ? "active" : ""}">
      ${isOther ? "instagram.com/p/…" : "https://youtu.be/6Yf4tPL6_Xw"}
    </div>
    <div class="field-label">모드</div>
    <div class="radio-row">
      <span class="${!isVideoMode && !isOther ? "selected" : ""} ${isAudioModeStep ? "target-active" : ""}">음원</span>
      <span class="${isVideoMode ? "selected" : ""} ${isVideoModeStep ? "target-active" : ""}">영상</span>
      ${isOther ? '<span class="selected">사진</span>' : ""}
    </div>
    <div class="field-label">포맷 / 품질</div>
    <div class="select-preview">
      ${isOther ? "JPG · 원본/권장" : isVideoMode ? "원본 최고품질 MKV" : "M4A (AAC) · 권장"}
    </div>
    ${
      isOther ? '<div class="check-row on">전체 사진 선택</div><div class="folder-note">사진·썸네일·영상 첫 장면을 구분해 선택</div>' : isVideoMode
        ? `
          <div class="check-row ${activeTarget === "extract-subtitles" ? "active" : ""}">
            한국어/영어 자막 포함
          </div>
        `
        : `
          <div class="check-row ${activeTarget === "extract-playlist" ? "active" : ""}">
            전체 플레이리스트 추출
          </div>
          <div class="check-row on ${activeTarget === "extract-metadata" ? "active" : ""}">
            실제 제목/아티스트 보정
          </div>
        `
    }
    <div class="field-label">저장 폴더</div>
    <div class="folder-row ${activeTarget === "extract-folder" ? "active" : ""}">
      <span>사용자 지정 폴더 선택</span>
      <span>기본값</span>
    </div>
    <small class="folder-note">기본 저장: ${folderPath}</small>
    <div class="mock-primary ${activeTarget === "extract-start" ? "active" : ""}">
      추출
    </div>
    ${tabsHtml(screenKey)}
  `;
}

function exampleHtml(detail) {
  if (!detail.example) {
    return "";
  }

  const example = detail.example;
  const escaped = escapeHtml(example.url).replace(
    "list=PLxA687tYuMWg_uIXlHU5lAOH11-QDw0OP",
    "<b>list=PLxA687tYuMWg_uIXlHU5lAOH11-QDw0OP</b>",
  );

  return `
    <div class="guide-example">
      ${example.image ? `<img src="${escapeHtml(example.image)}" alt="${escapeHtml(example.caption || "YouTube 플레이리스트 화면")}">` : ""}
      <span class="browser-mini">${escaped}</span>
      <span class="url-note">${escapeHtml(example.caption || "참고: list= 값이 붙은 YouTube 재생목록 URL")}</span>
    </div>
  `;
}

function pointsHtml(points) {
  return `
    <ol class="guide-points compact">
      ${points
        .map(
          ([title, body], index) => `
            <li>
              <span>${index + 1}</span>
              <div>
                <strong>${escapeHtml(title)}</strong>
                <p>${escapeHtml(body)}</p>
              </div>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;
}

function anchorIdForStep(step, index, seenScreens) {
  if (!seenScreens.has(step.screen)) {
    seenScreens.add(step.screen);
    return `guide-${step.screen}`;
  }
  return `guide-step-${index + 1}`;
}

function setHeroPreview(screenKey) {
  heroTabs.forEach((tab) => {
    const selected = tab.dataset.heroTab === screenKey;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", selected ? "true" : "false");
  });

  heroPhones.forEach((phone) => {
    const selected = phone.dataset.heroPhone === screenKey;
    phone.classList.toggle("is-active", selected);
  });
}

function renderGuideStack() {
  if (!guideStack) {
    return;
  }

  const seenScreens = new Set();
  guideStack.innerHTML = guideSteps
    .map((step, index) => {
      const screen = guideData[step.screen];
      const detail = screen.details[step.target] || screen;
      const anchorId = anchorIdForStep(step, index, seenScreens);
      const flippedClass = index % 2 === 1 ? " flipped" : "";

      return `
        <article class="guide-step-card${flippedClass}" id="${anchorId}">
          <div class="guide-visual phone-guide">
            <div class="phone-shell">
              <div class="phone-status"></div>
              <div class="app-screen">
                ${screenHtml(step.screen, step.target)}
              </div>
            </div>
          </div>
          <div class="guide-copy app-guide-copy">
            <p class="guide-step">Step ${String(index + 1).padStart(2, "0")} / ${escapeHtml(tabLabels[step.screen])}</p>
            <h3>${escapeHtml(detail.title)}</h3>
            <p>${escapeHtml(detail.text)}</p>
            ${exampleHtml(detail)}
            ${pointsHtml(detail.points || screen.points)}
          </div>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("click", (event) => {
  const heroTab = event.target.closest("[data-hero-tab]");
  if (heroTab) {
    setHeroPreview(heroTab.dataset.heroTab);
  }
});

function setupScrollEffects() {
  if (typeof window === "undefined") {
    return;
  }

  if (siteHeader) {
    const syncHeader = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  const revealTargets = document.querySelectorAll(
    ".download-section, .features, .workflow, .guide-card, .guide-step-card, .feature-grid article, .workflow-list li",
  );
  revealTargets.forEach((target) => target.classList.add("reveal-target"));

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  revealTargets.forEach((target) => observer.observe(target));
}

async function loadLatestApkRelease() {
  if (!latestApkLinks.length) {
    return;
  }

  const fallbackUrl = latestApkLinks[0].dataset.fallbackDownloadUrl || releasesPageUrl;
  latestApkLinks.forEach((link) => {
    link.href = "/api/latest-apk";
  });

  for (const url of releasesApiUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });
      if (!response.ok) {
        throw new Error(`Release API ${response.status}`);
      }
      const latest = latestStableRelease(await response.json());
      const asset = latest ? stableApkAsset(latest) : null;
      if (!latest || !asset) {
        throw new Error("Stable APK asset not found");
      }

      const versionName = `${latest.tag_name.replace(/^v/, "")}-android`;
      latestApkLinks.forEach((link) => {
        link.href = asset.browser_download_url;
        link.textContent = "최신 APK 다운로드";
      });
      if (releaseVersion) {
        releaseVersion.textContent = versionName;
      }
      if (releaseSize) {
        releaseSize.textContent = formatBytes(asset.size);
      }
      if (apkName) {
        apkName.textContent = asset.name;
      }
      releaseNotesLinks.forEach((link) => { link.href = `${releasesPageUrl}/tag/${latest.tag_name}`; });
      if (releaseStatus) {
        releaseStatus.textContent = `최신 정식 버전 ${latest.tag_name} · APK 직접 다운로드`;
      }
      return;
    } catch (error) {
      // Try the temporary source endpoint only until the public mirror is ready.
    }
  }
  latestApkLinks.forEach((link) => {
    link.href = fallbackUrl;
  });
  if (releaseStatus) {
    releaseStatus.textContent = "최신 정보를 불러오지 못했습니다. 다운로드 버튼에서 정식 릴리즈 목록을 확인해 주세요.";
  }
}

setHeroPreview(document.querySelector("[data-hero-tab].active")?.dataset.heroTab || "stream");
renderGuideStack();
setupScrollEffects();
loadLatestApkRelease();
