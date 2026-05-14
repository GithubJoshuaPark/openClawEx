# OpenClaw 재부팅 후 자동 실행 원인 분석 및 해결 방안

**작성일시**: 2026년 05월 14일  
**요청자**: Joshua  

---

## 1. 원인 분석 (`KeepAlive` 속성)

`ai.openclaw.gateway.plist` 파일의 `<key>RunAtLoad</key>`를 `<false/>`로 설정했음에도 불구하고 PC 재부팅 후 프로세스가 자동으로 실행된 원인은 **`<key>KeepAlive</key>` 속성이 `<true/>`로 설정되어 있기 때문**입니다.

- **macOS `launchd` 동작 방식**:
  - 사용자가 로그인하면 `~/Library/LaunchAgents/` 내의 plist 파일들이 자동으로 **로드(Load)**됩니다.
  - 파일이 로드될 때 `KeepAlive`가 `<true/>`로 설정되어 있으면, `launchd`는 해당 프로세스가 현재 구동 중이지 않음을 감지하고 **"항상 실행 상태를 유지(Keep Alive)"하기 위해 즉시 프로세스를 구동**시킵니다.
  - 따라서 `RunAtLoad` 속성과 무관하게 자동 실행이 발생합니다.

- **`killOpenclaw` 실행 시 사라지는 이유**:
  - `killOpenclaw` 명령어(`launchctl unload ...`)를 실행하면 서비스의 등록(Load) 상태 자체가 해제되므로, `KeepAlive` 감시 대상에서도 제외되어 프로세스가 완전히 종료됩니다.

---

## 2. 해결 방안 (완벽한 수동 실행으로 전환)

부팅 시 자동으로 실행되는 것을 완전히 방지하려면 `ai.openclaw.gateway.plist` 파일에서 **`KeepAlive` 속성 역시 `<false/>`로 변경**해야 합니다.

### 변경 대상 파일
`~/Library/LaunchAgents/ai.openclaw.gateway.plist`

### 수정 사항 (Diff)
```diff
  <key>RunAtLoad</key>
  <false/>
  <key>KeepAlive</key>
- <true/>
+ <false/>
  <key>ThrottleInterval</key>
```

> **주의 사항**: `KeepAlive`를 `<false/>`로 설정하면 수동으로(`runOpenclaw`) 구동한 이후 예기치 않은 오류로 프로세스가 종료되었을 때 `launchd`가 자동으로 재시작해주지 않습니다. 단순 로컬 테스트/개발용 게이트웨이라면 `<false/>`로 설정하여 필요할 때만 구동하는 것이 자원 관리에 유리합니다.
