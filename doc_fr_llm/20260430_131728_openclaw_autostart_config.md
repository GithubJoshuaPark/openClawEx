# OpenClaw 자동 실행 원리 및 설정 파일 분석

macOS에서 OpenClaw가 부팅(또는 사용자 로그인) 시 자동으로 실행되는 이유는 macOS의 기본 백그라운드 서비스 관리 시스템인 **launchd**에 사용자 에이전트(`LaunchAgent`)로 등록되어 있기 때문입니다.

`~/.zshrc`에 등록해 두신 alias 내용에서 볼 수 있듯이, 이 설정을 관장하는 파일은 아래 경로에 위치해 있습니다.
- **설정 파일 경로**: `~/Library/LaunchAgents/ai.openclaw.gateway.plist`

## 1. 자동 실행 핵심 설정 값
해당 `.plist` 파일을 분석한 결과, 아래의 속성에 의해 자동 실행이 제어되고 있습니다.

```xml
<key>RunAtLoad</key>
<true/>
<key>KeepAlive</key>
<true/>
```
- **`RunAtLoad` (`true`)**: 사용자가 Mac 환경에 로그인할 때 OS의 `launchd` 데몬이 이 plist 파일을 로드함과 동시에 OpenClaw를 자동으로 실행합니다.
- **`KeepAlive` (`true`)**: 프로그램이 예기치 않게 종료되거나 멈추더라도, `launchd`가 이를 감지하여 백그라운드에서 즉시 재시작하도록 보장합니다.

## 2. 실행되는 실제 명령어
이 설정 파일이 `launchd`를 통해 백그라운드에서 실행하는 실제 명령어 구성은 다음과 같습니다.
```xml
<key>ProgramArguments</key>
<array>
  <string>/usr/local/bin/node</string>
  <string>/Users/soromiso/.nvm/versions/node/v24.7.0/lib/node_modules/openclaw/dist/entry.js</string>
  <string>gateway</string>
  <string>--port</string>
  <string>18789</string>
</array>
```
즉, 내부적으로는 `node /Users/soromiso/.nvm/.../openclaw/dist/entry.js gateway --port 18789` 명령을 백그라운드로 띄워 동작시키고 있습니다.

## 3. 로그 기록 위치
터미널 창을 띄우지 않고 백그라운드에서 실행되기 때문에, 출력되는 로그는 다음의 파일들에 별도 기록되도록 설정되어 있습니다. 구동 중 문제가 발생했을 때는 이 파일들을 확인하시면 됩니다.
- **표준 출력 (일반 로그)**: `/Users/soromiso/.openclaw/logs/gateway.log`
- **표준 에러 (에러 로그)**: `/Users/soromiso/.openclaw/logs/gateway.err.log`

## 4. 제어 방법
만약 부팅 시 자동 실행을 원치 않으시거나 백그라운드 프로세스를 끄고 싶으실 경우, 이미 `~/.zshrc`에 정의해두신 alias를 활용하시면 됩니다.
- **서비스 중지 및 자동실행 해제**: `killOpenclaw` (`launchctl unload ...`)
- **서비스 상태 확인**: `listOpenclaw` (`launchctl list | grep openclaw`)
- **서비스 재등록 및 실행**: `runOpenclaw` (`launchctl load ...`)
