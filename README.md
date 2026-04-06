# OpenClawEx from installing and running the bot

> 2026-04-04 18:19 현장실습

![openClaw Workshop](openClaw_workshoip.png)

# 🦞 OpenClaw 설치 및 설정 가이드

> macOS (Intel CPU) 환경에서 OpenClaw를 설치하고 설정하는 과정을 정리한 문서입니다.

---

## 📋 목차

1. [OpenClaw란?](#1-openclaw란)
2. [사전 준비 - Node.js 버전 확인](#2-사전-준비---nodejs-버전-확인)
3. [OpenClaw 설치](#3-openclaw-설치)
4. [초기 설정 (onboard)](#4-초기-설정-onboard)
5. [Discord Bot 연동](#5-discord-bot-연동)
6. [웹 검색 설정](#6-웹-검색-설정)
7. [스킬 설정](#7-스킬-설정)
8. [에이전트 실행 — Gateway vs Terminal](#8-에이전트-실행--gateway-vs-terminal)
9. [Discord Bot 권한 설정](#9-discord-bot-권한-설정)
10. [트러블슈팅](#10-트러블슈팅)
11. [원격 프로젝트 관리 (iPhone & Discord)](#11-원격-프로젝트-관리-iphone--discord)
12. [Build-Before-Commit 프로토콜](#12-build-before-commit-프로토콜)
13. [고급 트러블슈팅: 404 모델 에러 해결](#13-고급-트러블슈팅-404-모델-에러-해결)
14. [Mission Control Dashboard (SPA)](#14-mission-control-dashboard-spa)
15. [맥북 재부팅 후 빠른 시작](#15-맥북-재부팅-후-빠른-시작)
16. [gateway status 출력 해석 가이드](#16-gateway-status-출력-해석-가이드)

---

## 1. OpenClaw란?

AI 에이전트를 운영할 수 있는 플랫폼입니다.

- AI가 자동으로 메시지를 보내거나 작업을 실행
- WhatsApp, Telegram, **Discord** 등 채팅 채널과 연동
- 웹 검색, 코드 실행, 파일 관리 등 다양한 스킬 지원
- Claude (Anthropic), OpenAI 등 다양한 AI 모델 연동 가능

```
나 (Discord/터미널에서 메시지 입력)
    ↓
OpenClaw Bot이 메시지 수신
    ↓
OpenClaw가 Claude AI에게 전달
    ↓
Claude가 답변 생성
    ↓
OpenClaw Bot이 채널에 답변 전송
    ↓
나 (Discord/터미널에서 답변 확인)
```

---

## 2. 사전 준비 - Node.js 버전 확인

OpenClaw는 **Node.js v22.14.0 이상**이 필요합니다.

```bash
# 현재 Node 버전 확인
node -v

# nvm으로 적합한 버전으로 전환 (v24.7.0 권장)
nvm use 24.7.0

# 기본값으로 설정
nvm alias default 24.7.0
```

> ⚠️ Homebrew Node(/usr/local/bin/node)가 nvm보다 PATH 우선순위가 높을 수 있으므로
> nvm use로 명시적으로 버전을 지정해야 합니다.

---

## 3. OpenClaw 설치

```bash
# 설치 스크립트 실행
curl -fsSL https://openclaw.ai/install.sh | bash

# 설치 확인
openclaw --version
# 출력 예: OpenClaw 2026.4.2 (d74a122)
```

### 설치 초기화

```bash
openclaw setup
```

성공 시 아래 파일/폴더가 생성됩니다:

- `~/.openclaw/openclaw.json` — 설정 파일
- `~/.openclaw/workspace` — 작업 공간
- `~/.openclaw/agents/main/sessions` — 에이전트 세션

---

## 4. 초기 설정 (onboard)

```bash
openclaw onboard
```

### 설정 단계별 선택 항목

| 단계           | 선택 항목             | 선택값                               |
| -------------- | --------------------- | ------------------------------------ |
| 개인용 확인    | Continue?             | **Yes**                              |
| 설정 모드      | Setup mode            | **QuickStart**                       |
| 기존값 유지    | Config handling       | **Use existing values**              |
| AI 모델 제공자 | Model/auth provider   | **Anthropic (Claude)**               |
| 인증 방식      | Anthropic auth method | **Anthropic API key**                |
| API 키 입력    | Enter API key         | `sk-ant-api03-xxxxxxxxxxxxxxxx` 입력 |
| 기본 모델      | Default model         | **Keep current (claude-sonnet-4-6)** |

> ⚠️ **보안 주의**: API 키는 절대 외부에 공유하지 마세요!
> 노출 시 즉시 https://console.anthropic.com/settings/keys 에서 재발급하세요.

---

## 5. Discord Bot 연동

### 5-1. Discord Developer Portal에서 Bot 생성

1. https://discord.com/developers/applications 접속
2. **"신규 애플리케이션"** 클릭
3. 이름 입력 (예: `OpenClaw Bot`)
4. 왼쪽 메뉴 **"봇"** 클릭
5. **"토큰 초기화"** 클릭 → 토큰 복사 (⚠️ 한 번만 표시됨!)

### 5-2. Privileged Gateway Intents 활성화 ⚠️ 필수!

봇 페이지 하단 **"Privileged Gateway Intents"** 에서 **3가지 모두** 활성화:

- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **MESSAGE CONTENT INTENT**

→ **Save Changes** 클릭

> ❌ 이 설정 없이 Gateway를 시작하면 **에러 4014** 발생 (봇이 메시지를 읽지 못함)

### 5-3. 채널 ID 복사

1. Discord 앱 → **설정 → 고급 → 개발자 모드** ON
2. 사용할 채널 **우클릭 → "채널 ID 복사하기"**

### 5-4. OpenClaw에서 Discord 설정

```
onboard 진행 중:
- Select channel → Discord (Bot API) 선택
- Discord bot token 입력
- Configure Discord channels access → Yes
- Channels allowlist → Allowlist 선택
- 채널 ID 입력 (예: 1031744690845921354)
```

### 5-5. Discord Bot을 서버에 초대

1. Discord Developer Portal → **OAuth2** 클릭
2. **URL Generator** → scope: `bot` 선택
3. 필요한 권한 선택 (아래 참고)
4. 생성된 URL로 서버에 초대

#### Bot 최소 필요 권한

| 권한 종류 | 항목                                         |
| --------- | -------------------------------------------- |
| 일반 권한 | 채널 보기                                    |
| 채팅 권한 | 메시지 보내기, 메시지 기록 보기, 메시지 읽기 |

---

## 6. 웹 검색 설정

```
onboard 진행 중:
- Search provider → DuckDuckGo Search (experimental) 선택
  (API 키 없이 무료 사용 가능)
```

### 다른 검색 제공자 (선택사항)

| 제공자       | 특징                            |
| ------------ | ------------------------------- |
| DuckDuckGo   | 무료, API 키 불필요 (기본 추천) |
| Brave Search | API 키 필요, 빠르고 정확        |
| Tavily       | AI 최적화 검색                  |
| Perplexity   | AI 기반 검색                    |

---

## 7. 스킬 설정

### 기본 제공 스킬 (10개, 즉시 사용 가능)

추가 설정 없이 바로 사용 가능합니다.

### 선택적 스킬 (API 키 필요)

| 스킬             | 용도                    | API 키 발급처                         |
| ---------------- | ----------------------- | ------------------------------------- |
| `goplaces`       | 장소 검색 (Google Maps) | https://console.cloud.google.com      |
| `notion`         | Notion 연동             | https://www.notion.so/my-integrations |
| `openai-whisper` | 음성→텍스트 변환        | https://platform.openai.com/api-keys  |

### Hooks (자동화 규칙)

| Hook                    | 설명                               |
| ----------------------- | ---------------------------------- |
| `boot-md`               | 시작 시 마크다운 파일 자동 로드    |
| `bootstrap-extra-files` | 시작 시 추가 파일 로드             |
| `command-logger`        | 명령어 자동 로그 기록              |
| `session-memory`        | 대화 내용 자동 메모리 저장 (추천!) |

---

## 8. 에이전트 실행 — Gateway vs Terminal

OpenClaw에는 **두 가지 실행 모드**가 있습니다.

### 8-1. Gateway 모드 — `openclaw gateway start`

```
사용자 ←→ Discord 앱 ←→ Discord 서버 ←→ OpenClaw Gateway (백그라운드) ←→ AI 에이전트
```

- macOS `LaunchAgent`로 **백그라운드 데몬** 실행 — 터미널을 닫아도 계속 동작
- Discord에서 `@OpenClaw Bot` 멘션으로 대화
- 모바일(iOS/Android) Discord에서도 사용 가능, 푸시 알림 수신
- 봇이 **먼저 말을 걸 수 있음** (리마인더, 배포 알림 등)
- 대시보드: Gateway 실행 중이면 http://127.0.0.1:18789/ 에서 웹 대시보드 확인 가능

```bash
# Gateway 시작 / 종료 / 재시작 / 상태확인
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway status
```

### 8-2. Terminal 모드 — `openclaw`

```
사용자 ←→ 터미널 (직접 입력) ←→ AI 에이전트
```

- 터미널 안에서 에이전트와 **1:1 대화형 세션** — 터미널을 닫으면 세션도 종료
- Discord 없이 바로 사용 가능
- **파일 시스템에 직접 접근** — 코드 수정, git 작업, 파일 생성을 에이전트가 바로 실행
- 빠른 1회성 질문이나 코드 작업에 적합

```bash
# 터미널 대화형 세션 시작
openclaw
```

### 8-3. 비교 요약

| 항목           | Gateway         | Terminal          |
| -------------- | --------------- | ----------------- |
| 실행 방식      | 백그라운드 데몬 | 포그라운드 대화형 |
| 터미널 닫으면? | **계속 동작**   | **세션 종료**     |
| 대화 채널      | Discord         | 터미널            |
| 모바일 사용    | ✅              | ❌                |
| 푸시 알림      | ✅              | ❌                |
| 봇이 먼저 연락 | ✅              | ❌                |
| 로컬 파일 접근 | ✅              | ✅                |

> 💡 **둘은 동시에 실행 가능합니다.** Gateway로 Discord 봇을 띄워놓고, 터미널에서 `openclaw`로 별도 세션을 열어 작업해도 충돌 없습니다.

### 에이전트 초기화 메시지 예시 (최초 1회)

```
안녕! 나는 1인 개발자로 SaaS 서비스를 만들고 있어.
너의 이름은 "Claw"로 해줘.

내 목표는 LLM과 자동화 도구를 적극 활용해서 개발 생산성을 최대한 높이는 거야.

네가 도와줬으면 하는 것들:
- 코드 작성, 리뷰, 디버깅
- 기술 문서 작성
- 아이디어 정리 및 기획
- 웹 검색으로 최신 기술 트렌드 파악
- 반복적인 개발 작업 자동화

나는 한국어로 대화하는 걸 선호해. 앞으로 잘 부탁해!
```

### 주요 에이전트 설정 파일

```
~/.openclaw/workspace/
├── AGENT.md     # 에이전트 전역 행동 규칙
├── USER.md      # 나에 대한 정보
└── PROJECTS.md  # 프로젝트 정보
```

---

## 9. Discord Bot 권한 설정

Discord Bot이 서버에서 동작하는 방식:

```
Discord #채널에서 메시지 입력
    ↓
OpenClaw Bot 수신
    ↓
Claude AI 처리
    ↓
Discord #채널에 답변
```

> 맥북이 켜져 있고 OpenClaw가 실행 중이면
> **모바일 Discord 앱에서도 AI와 대화 가능!**

---

## 10. 트러블슈팅

### 🔴 Node.js 버전 오류

**증상:**

```
openclaw requires Node >=22.14.0. Detected: node 22.12.0
```

**원인:** nvm 기본값은 v24.7.0인데, `/usr/local/bin/node`가 옛 버전을 가리킴

**해결:**

```bash
# 방법 1: nvm으로 전환
nvm use 24.7.0
openclaw gateway start

# 방법 2: 시스템 Node 심볼릭 링크 영구 수정
sudo ln -sf ~/.nvm/versions/node/v24.7.0/bin/node /usr/local/bin/node
```

### 🔴 Gateway WebSocket 4014 에러

**증상:**

```
discord: gateway: Gateway websocket closed: 4014
discord: [default] auto-restart attempt 1/10 in 5s
```

**원인:** Discord Developer Portal에서 Privileged Gateway Intents 미활성화

**해결:**

1. [discord.com/developers/applications](https://discord.com/developers/applications) 접속
2. OpenClaw Bot → **Bot** → **Privileged Gateway Intents**
3. 3가지 모두 ✅ 활성화 → **Save Changes**
4. `openclaw gateway restart`

### 🔴 Config Invalid 에러

**증상:**

```
Invalid config at ~/.openclaw/openclaw.json:
- channels.discord: Unrecognized key: "defaultChannel"
```

**원인:** OpenClaw가 지원하지 않는 키가 config에 추가됨

**해결:**

```bash
# 잘못된 키 삭제
node -e "
const fs = require('fs');
const path = process.env.HOME + '/.openclaw/openclaw.json';
const config = JSON.parse(fs.readFileSync(path));
delete config.channels.discord.defaultChannel;
fs.writeFileSync(path, JSON.stringify(config, null, 2));
console.log('완료');
"
openclaw gateway restart
```

### 🔴 nvm 경로 의존 경고

**증상:** `openclaw gateway status` 실행 시:

```
Service config issue: Gateway service uses Node from a version manager;
it can break after upgrades.
Recommendation: run "openclaw doctor" (or "openclaw doctor --repair").
```

**원인:** LaunchAgent가 nvm 경로(`~/.nvm/versions/node/...`)를 직접 참조해서, Node 버전 변경 시 깨질 수 있음

**해결:**

```bash
openclaw doctor --repair
```

> 이 명령은 nvm 의존 없이 안정적인 경로로 LaunchAgent를 재설정합니다.

### API Rate Limit 오류

**증상:**

```
⚠️ API rate limit reached. Please try again later.
```

**해결:** 1~2분 대기 후 재시도
한도 확인: https://console.anthropic.com/settings/limits

### Bot이 Discord 채널에서 응답 안 할 때

1. `openclaw doctor` 로 상태 확인
2. Privileged Gateway Intents 3가지 활성화 여부 확인
3. 채널 ID가 올바른지 확인
4. Bot이 서버에 초대되었는지 확인

---

## 📌 자주 사용하는 명령어

```bash
# 에이전트 실행
openclaw                  # 터미널 대화형 세션
openclaw gateway start    # Discord 봇 백그라운드 시작
openclaw gateway stop     # Gateway 종료
openclaw gateway restart  # Gateway 재시작
openclaw gateway status   # Gateway 상태 확인

# 관리
openclaw status           # 채널 연동 상태 확인
openclaw doctor           # 상태 점검
openclaw doctor --repair  # 상태 점검 + 자동 수정
openclaw configure        # 설정 변경
openclaw logs             # 실시간 로그 확인
openclaw dashboard        # 웹 대시보드 열기
openclaw update           # 업데이트
```

---

## 11. 원격 프로젝트 관리 (iPhone & Discord)

OpenClaw를 통해 로컬 맥북에 있는 여러 프로젝트를 외부(iPhone Discord 앱)에서 관리할 수 있습니다.

### 📁 관리 대상 프로젝트 경로

- `fieldMates`: `~/Desktop/Dev/soromiso/fieldMates`
- `seoultrip`: `~/Desktop/Dev/soromiso/seoultrip`
- `soromiso.kr`: `~/Desktop/Dev/soromiso/soromiso.kr`

### 📱 Discord를 통한 주요 조작 (예시)

- **상태 확인**: "fieldMates 프로젝트 진행 상황 알려줘"
- **코드 수정**: "seoultrip의 Header.tsx 컴포넌트 색상을 Blue로 변경해줘"
- **빌드 테스트**: "soromiso.kr 빌드 돌려보고 에러 있으면 보고해"

---

## 12. Build-Before-Commit 프로토콜

안정적인 배포를 위해 모든 코드 수정 후에는 반드시 빌드 검증을 거쳐야 합니다.

```bash
# 1. 의존성 설치 확인
npm install

# 2. 빌드 검증 (가장 중요)
npm run build

# 3. 빌드 성공 시에만 Git 커밋 및 푸시
git add .
git commit -m "feat: UI enhancement and build verified"
git push origin main
```

> ⚠️ **OpenClaw 자동화 규칙**: 에이전트가 코드를 수정할 때도 이 프로토콜을 준수하도록 `SOUL.md`에 정의되어 있습니다.

---

## 13. 고급 트러블슈팅: 404 모델 에러 해결

Gemini 모델 사용 중 `404 Not Found` 에러가 발생할 경우, 모델 버전의 지원 중단(Deprecation) 여부를 확인해야 합니다.

### 🚨 에러 증상

- Discord 또는 TUI에서 대화 시도 시 응답 없이 404 에러 로그 기록

### ✅ 해결 방법 (`openclaw.json` 수정)

1. `~/.openclaw/openclaw.json` 파일을 엽니다.
2. `primaryModel` 및 `activeModel` 설정을 최신 버전으로 업데이트합니다.
   - **기존**: `gemini-1.5-flash`
   - **변경**: `gemini-2.5-flash` (현 시점 최신 안정 버전)

```json
{
  "models": {
    "primaryModel": "google/gemini-2.5-flash",
    "activeModel": "google/gemini-2.5-flash"
  }
}
```

---

## 14. Mission Control Dashboard (SPA)

프로젝트의 전체 상태를 시각적으로 모니터링할 수 있는 대시보드 환경입니다.

- **컨셉**: 상황실(Mission Control) 스타일의 프리미엄 UI
- **기술 스택**: React + Vite + Tailwind CSS + Framer Motion
- **주요 기능**:
  - OpenClaw 게이트웨이 및 모델 상태 실시간 표시
  - 프로젝트별 빌드 상태 및 최근 활동 로그 시각화
  - 가이드 문서(README)의 핵심 내용 요약 제공

---

## 15. 맥북 재부팅 후 빠른 시작

맥북을 끄거나 재부팅하면 nvm 환경과 OpenClaw Gateway가 초기화됩니다.
아래 순서에 따라 다시 시작하세요.

### 15-1. 빠른 시작 (Quick Start)

```bash
# 1. 터미널 열기 (⌘ + Space → "Terminal" 검색)

# 2. nvm 활성화
source ~/.nvm/nvm.sh

# 3. Node.js v24.7.0 활성화
nvm use 24.7.0

# 4. Node 버전 확인 (v24.7.0 이 출력되어야 함)
node --version

# 5. OpenClaw Gateway 시작
# Discord 등 채널 연동 데몬을 백그라운드로 실행
openclaw gateway start
```

### 15-2. 💡 매번 입력이 귀찮다면 — 쉘 Alias 등록

`~/.zshrc` 파일 맨 아래에 다음을 추가하면 한 단어로 시작할 수 있습니다:

```bash
# ~/.zshrc 에 추가
alias claw='source ~/.nvm/nvm.sh && nvm use 24.7.0 && openclaw gateway start'   # Discord 봇
alias clawchat='source ~/.nvm/nvm.sh && nvm use 24.7.0 && openclaw'             # 터미널 채팅
```

저장 후 반영:

```bash
source ~/.zshrc
```

이후부터는:

```bash
claw        # Discord 봇 시작 (백그라운드)
clawchat    # 터미널에서 에이전트와 직접 대화

# Discord 봇과 터미널 에이전트를 동시에 시작
claw && sleep 5 && clawchat

# 터미널 에이전트 (openclaw tui) 종료
# Ctrl + C 를 두번 누르면 종료됨

# openclaw agent 종료
# 터미널에서 openclaw agent stop 입력

# 터미널에서 모든 openclaw 프로세스 종료
# ps aux | grep openclaw | grep -v grep | awk '{print $2}' | xargs kill -9
```

---

## 16. `gateway status` 출력 해석 가이드

`openclaw gateway status` 실행 시 출력되는 각 항목의 의미입니다.

### Service (macOS LaunchAgent)

| 항목                   | 의미                                                   |
| ---------------------- | ------------------------------------------------------ |
| `LaunchAgent (loaded)` | macOS `launchd`에 등록되어 백그라운드 서비스로 동작 중 |
| `File logs`            | 오늘 날짜 로그 파일 경로. 문제 발생 시 여기서 확인     |
| `Command`              | 실제 실행되는 Node.js 프로세스 전체 경로               |
| `Service file`         | LaunchAgent plist 파일 위치                            |
| `Service env`          | Gateway가 사용하는 포트 번호                           |

### Gateway 네트워크

| 항목                   | 의미                                                    |
| ---------------------- | ------------------------------------------------------- |
| `loopback (127.0.0.1)` | 외부 접속 차단, 본인 맥에서만 접근 가능 (보안상 정상)   |
| `ws://`                | WebSocket으로 Discord와 실시간 통신                     |
| `Dashboard`            | 브라우저에서 해당 URL을 열면 Gateway 대시보드 확인 가능 |

### Runtime 상태

| 항목                                | 의미                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `running (pid XXXXX, state active)` | ✅ 정상 동작 중                                             |
| `RPC probe: ok`                     | 내부 통신 정상                                              |
| `Gateway not running`               | ⚠️ Gateway가 꺼져 있음 → `openclaw gateway start` 실행 필요 |

### 경고 메시지

```
Service config issue: Gateway service uses Node from a version manager;
it can break after upgrades.
```

→ nvm 경로 의존 경고. `openclaw doctor --repair` 실행으로 해결.

---

## 17. 🛡️ OpenClaw 삼중 방어막(Triple Shield) 구축

OpenClaw의 서비스 안정성을 극대화하기 위해 **Gemini -> Claude -> GPT-4o**로 이어지는 고가용성 모델 Fallback 체인을 구축했습니다. 

### ⚙️ 시스템 아키텍처 및 설정

1. **지능형 모델 Failover (`openclaw.json`)**
   * **Primary**: `google/gemini-2.5-flash`
   * **Fallback 1**: `anthropic/claude-sonnet-4-6`
   * **Fallback 2**: `openai/gpt-4o`
   * API 호출 장애나 Rate Limit 발생 시 지연 없이 다음 모델로 자동 전환됩니다.

2. **보안 인증 통합 (`auth-profiles.json`)**
   * OpenAI API 키(`sk-proj-...`)를 시스템 내부 보안 저장소에 정식 등록했습니다.
   * 별도의 수동 로그인 과정 없이 Fallback 상황에서 즉시 에이전트 구동이 가능합니다.

3. **운영 안정성 검증**
   * **Doctor Check**: 구성 파일 무결성 및 시스템 환경 검증 완료.
   * **Gateway Status**: LaunchAgent 서비스 재가동 및 실시간 처리 확인.

### 📊 실시간 상태 요약

| 구성 요소 | 현재 상태 | 상세 설명 |
| :--- | :--- | :--- |
| **Primary Shield** | 🟢 **ACTIVE** | Gemini 2.5 Flash 기반 메인 에이전트 |
| **Secondary Shield** | 🟢 **READY** | Claude Sonnet 4.6 (Failover 1) |
| **Tertiary Shield** | 🟢 **READY** | GPT-4o (Failover 2) |
| **Auth Profiles** | ✅ **VERIFIED** | Gemini / Claude / OpenAI 인증 완료 |

> [!TIP]
> **Dynamic Resilience**: 네트워크 불안정이나 API 사용량 초과 시에도 OpenClaw가 지능적으로 최적의 모델을 선택하여 작업의 연속성을 유지합니다.

---

## 🔗 참고 링크

- 공식 문서: https://docs.openclaw.ai/cli
- Anthropic Console: https://console.anthropic.com
- Discord Developer Portal: https://discord.com/developers/applications
- Google Cloud Console: https://console.cloud.google.com

---

> 📝 작성일: 2026년 4월
> 환경: macOS Intel, Node.js v24.7.0, OpenClaw 2026.4.2

🦞 **OpenClaw와 함께 지능적이고 창의적인 개발 여정을 시작하세요!**
