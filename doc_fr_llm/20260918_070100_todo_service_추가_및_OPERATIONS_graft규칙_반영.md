# todo-service 워크스페이스 추가 및 OPERATIONS.md Graft 규칙 동기화 완료 보고

- **작성 일시**: 2026-09-18 07:05:30
- **수신자**: Joshua
- **작업 목적**:
  1. `/Users/soromiso/Desktop/Dev/soromiso/todo-service` 프로젝트를 OpenClaw 워크스페이스에 신규 등록.
  2. OpenClaw 공용 워크스페이스 및 전체 개별 프로젝트(`openClawEx`, `fieldMates`, `mypccheck`, `soromiso.kr`, `sorotrip`, `todo-service`)의 `OPERATIONS.md`에 Antigravity 전역 Graft 사용 규칙 동기화.

---

## 1. todo-service 워크스페이스 등록 내역

1. **심볼릭 링크(Symlink) 생성 완료**:
   - `~/.openclaw/workspace/todo-service` → `/Users/soromiso/Desktop/Dev/soromiso/todo-service`
2. **에이전트 인지 설정 (`SOUL.md`) 갱신**:
   - [**`~/.openclaw/workspace/SOUL.md`**](file:///Users/soromiso/.openclaw/workspace/SOUL.md)의 `Boundaries` 항목에 `todo-service` (및 누락되었던 `mypccheck`, `sorotrip`) 프로젝트 목록을 정식 등록:
     ```markdown
     - `openClawEx`, `fieldMates`, `mypccheck`, `soromiso.kr`, `sorotrip`, `todo-service`
     ```

---

## 2. OPERATIONS.md 내 Graft 규칙 반영 상세

최근 Antigravity 전역 규칙에 추가된 **Graft (코드 지식 그래프 기반 분석)** 원칙을 `OPERATIONS.md`의 정식 운영 규정으로 수립했습니다:

### 핵심 추가 규정 (Section 5: Graft Context Rules)
1. **사전 탐색 및 핀포인트 추출 (Selective Context)**:
   - `graft/INDEX.md` 및 Wiring Cards를 우선 참조하여 탐색 범위를 축소.
   - `graft ask "<질의>"`, `graft callers <심볼>`, `graft skeleton <파일>`, `graft blast`를 통해 필요한 맥락만 핀포인트 추출.
2. **리팩토링 전 영향도(Edge) 사전 검증**:
   - 엔티티, DTO, 공통 Service, Config 수정 전 `graft callers <심볼>` 등으로 호출 관계를 사전 점검하여 사이드 이펙트 차단.
3. **지식 그래프 갱신 의무화 (Mandatory Graph Sync)**:
   - 유의미한 코드/아키텍처 변경 후 `graft build` 또는 갱신 스크립트(`update_graph_using_graft.sh` 등) 실행 강제.
4. **프로젝트 해석 우선순위 개정**:
   - `1. README.md` → `2. documents/ERD.md` → `3. graft/ 지식 그래프` → `4. 현재 소스 코드` → `5. Graphify 결과`
5. **표준 운영 파이프라인 정리**:
   - **코드 수정 → Graft 영향도 확인 → README/ERD 동기화 → graft build 갱신 → doc_fr_llm 기록 → 빌드 검증 / 커밋**

---

## 3. 동기화 적용 파일 목록

| 번호 | 파일 경로 | 적용 내용 |
| :--- | :--- | :--- |
| **공용** | [**`~/.openclaw/workspace/OPERATIONS.md`**](file:///Users/soromiso/.openclaw/workspace/OPERATIONS.md) | OpenClaw 메인 공용 운영 메모 갱신 |
| **공용** | [**`~/.openclaw/workspace/SOUL.md`**](file:///Users/soromiso/.openclaw/workspace/SOUL.md) | 관리 대상 프로젝트 목록에 `todo-service` 반영 |
| 1 | [**`todo-service/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/soromiso/todo-service/OPERATIONS.md) | 신규 추가 프로젝트 맞춤 운영 규정 생성 (다중 모듈 대응) |
| 2 | [**`openClawEx/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/openClawEx/OPERATIONS.md) | openClawEx 대시보드 프로젝트 운영 규정 생성 |
| 3 | [**`fieldMates/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/soromiso/fieldMates/OPERATIONS.md) | fieldMates (실습 SaaS) 운영 규정 생성 |
| 4 | [**`mypccheck/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/soromiso/mypccheck/OPERATIONS.md) | mypccheck (시스템 진단 앱) 운영 규정 생성 |
| 5 | [**`soromiso.kr/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/soromiso/soromiso.kr/OPERATIONS.md) | soromiso.kr (통합 플랫폼) 운영 규정 생성 |
| 6 | [**`sorotrip/OPERATIONS.md`**](file:///Users/soromiso/Desktop/Dev/soromiso/sorotrip/OPERATIONS.md) | sorotrip (여행 소셜 서비스) 운영 규정 생성 |

---

## 4. 결론 및 검증

- `~/.openclaw/workspace/` 심볼릭 링크 정상 연결 확인 완료 (`lrwxr-xr-x`).
- 모든 프로젝트 루트 및 OpenClaw 워크스페이스의 `OPERATIONS.md`에 최신 Graft 사용 규칙이 완벽하게 일관성을 유지하도록 배포되었습니다.
- 이제 OpenClaw 에이전트(Terminal 모드 및 Discord Gateway 모드 모두)가 `todo-service`를 안전하게 탐색하고, 코드 수정 시 Graft 영향도 검증 프로토콜을 준수하게 됩니다.
