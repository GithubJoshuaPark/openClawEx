# OpenClaw Workspace 추가 및 프로세스 상태 점검 가이드

- **작성 일시**: 2026-09-18 06:53:30
- **수신자**: Joshua
- **문서 목적**: OpenClaw 에이전트가 프로젝트 디렉토리를 참조할 수 있도록 워크스페이스를 추가/수정하는 방법 및 현재 프로세스 상태 안내

---

## 1. 현재 OpenClaw 프로세스 상태 분석

`openclaw gateway status` 확인 결과:
- **Service**: `LaunchAgent (loaded)` (서비스 파일은 로드되어 있음)
- **Runtime**: `stopped (state not running)` (프로세스가 실행 중이지 않음)
- **원인**: 과거 자동 실행 방지를 위해 `~/Library/LaunchAgents/ai.openclaw.gateway.plist`에서 `RunAtLoad` 및 `KeepAlive`를 비활성화해 두었기 때문입니다.
- **실행 방법**:
  - Discord 연동 백그라운드 구동: `openclaw gateway start` (또는 alias `claw`)
  - 터미널 1:1 대화형 세션: `openclaw` (또는 alias `clawchat`)

---

## 2. OpenClaw가 프로젝트를 참조하는 구조

OpenClaw의 메인 설정 파일인 [**`~/.openclaw/openclaw.json`**](file:///Users/soromiso/.openclaw/openclaw.json)에 기본 작업 공간이 다음과 같이 정의되어 있습니다:

```json
{
  "agents": {
    "defaults": {
      "workspace": "/Users/soromiso/.openclaw/workspace"
    }
  }
}
```

이 `workspace` 디렉토리는 에이전트의 프롬프트(`SOUL.md`, `AGENTS.md`, `USER.md`), 장기 메모리(`memory/`), 설정이 상주하는 **에이전트의 홈(Home)** 역할을 합니다.

---

## 3. 새로운 프로젝트 디렉토리를 Workspace로 추가하는 방법 (권장 방식)

새로운 프로젝트 디렉토리를 OpenClaw가 접근하고 인지할 수 있도록 하려면 다음 2단계를 진행합니다.

### 1단계: 심볼릭 링크(Symlink) 생성
`~/.openclaw/workspace/` 안에 대상 프로젝트 폴더를 심볼릭 링크로 연결합니다.

```bash
# 예시: 새로운 프로젝트(newProject)를 연결할 때
ln -s /Users/soromiso/Desktop/Dev/경로/newProject /Users/soromiso/.openclaw/workspace/newProject
```

*현재 이미 연결되어 있는 프로젝트 목록:*
- `fieldMates` -> `/Users/soromiso/Desktop/Dev/soromiso/fieldMates`
- `mypccheck` -> `/Users/soromiso/Desktop/Dev/soromiso/mypccheck`
- `openClawEx` -> `/Users/soromiso/Desktop/Dev/openClawEx`
- `soromiso.kr` -> `/Users/soromiso/Desktop/Dev/soromiso/soromiso.kr`
- `sorotrip` -> `/Users/soromiso/Desktop/Dev/soromiso/sorotrip`

### 2단계: 프롬프트 및 운영 문서에 프로젝트 등록
OpenClaw가 세션을 시작할 때 로드하는 설정 문서에 새 프로젝트를 명시해 줍니다:

1. [**`~/.openclaw/workspace/SOUL.md`**](file:///Users/soromiso/.openclaw/workspace/SOUL.md):
   - `## Boundaries` -> `Local Workspaces (Direct Linking)` 섹션에 새 프로젝트 이름 추가.
2. [**`~/.openclaw/workspace/OPERATIONS.md`**](file:///Users/soromiso/.openclaw/workspace/OPERATIONS.md):
   - 해당 프로젝트의 운영 및 빌드 규칙이 있다면 추가.
3. [**`~/.openclaw/workspace/AGENTS.md`**](file:///Users/soromiso/.openclaw/workspace/AGENTS.md):
   - 에이전트의 기본 행동 지침 동기화.

---

## 4. 확인 및 수정 대상 파일 요약

| 파일 경로 | 역할 및 수정 내용 |
| :--- | :--- |
| [**`~/.openclaw/openclaw.json`**](file:///Users/soromiso/.openclaw/openclaw.json) | 기본 워크스페이스 루트 경로(`agents.defaults.workspace`) 정의 |
| [**`~/.openclaw/workspace/`**](file:///Users/soromiso/.openclaw/workspace/) | 프로젝트 폴더 심볼릭 링크 생성 위치 (`ln -s <실제경로> <링크명>`) |
| [**`~/.openclaw/workspace/SOUL.md`**](file:///Users/soromiso/.openclaw/workspace/SOUL.md) | 에이전트가 인식할 관리 대상 프로젝트 목록(`Boundaries`) 명시 |
| [**`~/.openclaw/workspace/OPERATIONS.md`**](file:///Users/soromiso/.openclaw/workspace/OPERATIONS.md) | 프로젝트 공용 빌드 및 운영 규칙 명시 |
