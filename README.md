# factualpost

## 개발 과정
### 아키텍처 리팩토링 및 DI 구조 전환
  - Express → NestJS, JavaScript → TypeScript, Raw Query → TypeORM으로 점진적 전환을 주도하여 코드 품질과 유지보수성을 향상시켰습니다.
  - InversifyJS 기반의 직접 생성 방식을 NestJS의 DI 컨테이너로 개선하여 객체 생성을 외부로 분리하고 모듈 간 결합도를 낮췄습니다.
  - SRP(Single Responsibility Principle) 기반의 Controller–Service–Repository 3계층 구조를 적용하여 코드 응집도를 높이고 가독성을 개선했습니다.
  - TypeORM 도입으로 SQL Injection 등 보안 리스크를 줄이고, 추상화된 메서드를 활용하여 안전하고 일관된 데이터 접근 방식을 구현했습니다.​
  - Nest로 마이그레이션까지 마쳤습니다.

### 테스트 가능성 및 유지보수성 강화
  - 외부 모듈 및 설정값에 대한 직접 의존을 제거하고, 인터페이스 기반 추상화 및 모킹이 용이한 테스트 환경을 구성하여 유닛 테스트의 독립성과 생산성을 강화했습니다.
  - DI를 통해 테스트 가능한 구조를 설계하여 유지보수성과 확장성을 확보했습니다.​

### 성능 최적화 및 트러블슈팅
- Redis 캐싱 및 Pipeline 도입
  - Like 요청 시 DB에 직접 업데이트하던 구조로 인해 발생한 MySQL Row-level Lock 경합을 해결하기 위해 Redis 기반 캐시 레이어를 도입했습니다.
  - 초기에는 Redis의 KEYS 명령어를 사용하여 모든 Article Key를 조회했지만, 이는 전체 탐색으로 인해 응답 지연이 발생했습니다. 이를 해결하기 위해 Redis의 SET 자료구조를 활용하여 Like Count를 기록한 Article ID만을 중복 없이 관리하고, 해당 Set을 기준으로 필요한 Key만 조회하는 방식으로 변경했습니다.
  - Redis Pipeline 기능을 도입하여, 기존 Key 개수만큼 발생하던 RTT(Round Trip Time)를 2회로 줄여 네트워크 오버헤드를 대폭 감소시켰습니다.​

- MySQL 쿼리 최적화
  - MySQL의 Row-level Lock 기반 동시성 제공 특성상, UPDATE 시 인덱스를 타지 않으면 전체 테이블 스캔이 발생하며, 해당 테이블의 모든 Row에 Lock이 걸립니다. 이를 해결하기 위해 UPDATE 쿼리의 WHERE 절이 반드시 인덱스를 타도록 쿼리 구조를 개선하여 Full Table Scan을 방지하고, Row-level Lock이 실제 대상 Row에만 적용되도록 하여 Lock 경쟁을 최소화했습니다.​

- 성능 개선 결과
  - 평균 응답 시간: 580ms → 42ms (93% 개선)
  - 95 Percentile 응답 시간: 988ms → 102ms (89% 개선)
  - Redis Pipeline 도입으로 RTT N회 → 2회 최적화, System Call 1/1000 수준 절감
  - 쿼리 인덱스 최적화로 Full Table Scan 제거, Index Scan 전환
  - RPS 700 환경에서도 안정적 처리 유지 (평균 42ms, 95Percentile 102ms)​

---

- BullMQ 기반 비동기 아키텍처 도입
  - RPS와 TPS가 700 이상 발생하는 환경에서, MySQL의 max_connections 기본값인 151의 한계로 인해 Connection 고갈 및 Lock Wait 현상이 발생했습니다. 이를 해결하기 위해 BullMQ 기반 Queue 시스템을 도입하여, Like 관련 이벤트를 Queue에 적재하고, Worker가 이를 순차적으로 처리하는 방식으로 전환했습니다.

  - 이를 통해 트래픽 완충(Buffering), DB 자원 보호, Row-level-lock 회피, Write-Through 처리 안정성을 확보했습니다.​

- 비동기 처리 성능 개선 결과
  - 평균 응답 시간: 580ms → 25ms (96% 개선)
  - 95 Percentile 응답 시간: 988ms → 88ms (91% 개선)
  - TPS 초당 387 수준으로 안정화
  - Connection 고갈 및 Lock 경합 현상 제거, DB 안정성 확보​

---

- 분산락 도입
  - Cron 동작시 여러대의 서버가 하나의 자원에 접근할 수 있습니다. 
  - Scale Out시에 유연한 대처를 위해서, Redis에 관한 분산락을 적용할 필요가 있습니다.
  - Redis에 락을 걸지 못한다면 Race Condition 문제가 발생할 수 있습니다.

- 2가지 상황 예시
  - 1대의 Redis 서버 N대의 Node 서버
     - 1대의 Redis는 N대의 Node 서버가 동시에 접근해 데이터에 접근할 수 있습니다.
     - Redis의 메서드를 사용해서 키를 생성해 해당 키가 존재한다면, 다른 서버는 동작할 수 없습니다.
  - N대의 Redis 서버, M대의 Node 서버
     - Redlock을 사용해 Redis의 instance 3대에 Lock을 먼저 건 서버가 점유를 합니다.
     - 해당 전제조건은 Redis 서버가 세대가 있어야합니다.
     - 이외에도 Kafka의 Producer, Consumer 방식을 사용해서 처리하는 방법이 존재합니다.

---

## 프로젝트 전체적인 구조

![비동기 큐 넣은 서버 구조](https://github.com/user-attachments/assets/7758b51b-9c54-41e2-bd96-e291223dd17f)

- 향후 확장 고려 사항
  - RPS가 1,000 이상으로 증가할 경우, Master-Slave 구조 도입 및 Read/Write 분리 전략을 통해 확장성을 확보할 계획입니다.​

## 추후 개선 구조

![추후_아키텍처_구조](https://github.com/user-attachments/assets/5e442235-5edc-4474-b156-1ad6935cb4f8)


## 꽤나 깊은 생각들

https://github.com/f-lab-edu/factualpost/pull/12
