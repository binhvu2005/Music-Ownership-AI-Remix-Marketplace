---
title: Testing Rules — StemVerse
version: 1.0.0
created: 2026-05-26
---

# Testing Rules — StemVerse

## Philosophy

> Tests are not optional. Tests are the proof that code works.
> Without proof, there is no done.

## Test Types

| Type | Location | Tools | Coverage |
|------|---------|-------|---------|
| Unit | `*.spec.ts` next to file | Jest | 85%+ |
| Integration | `test/*.e2e-spec.ts` | Jest + Supertest | Key flows |
| E2E | Future (Phase 2) | Playwright | Critical paths |

---

## TDD Workflow (MANDATORY)

```
1. 🔴 RED: Write failing test
   - Test describes the BEHAVIOR, not implementation
   - Run: npm test → see RED
   
2. 🟢 GREEN: Write minimal code to pass
   - Absolutely minimal — no extras
   - Run: npm test → see GREEN
   
3. 🔵 REFACTOR: Clean up
   - Remove duplication
   - Improve names
   - Run: npm test → still GREEN
```

---

## Unit Test Structure

### NestJS Service Test

```typescript
// songs.service.spec.ts
describe('SongsService', () => {
  let service: SongsService;
  let mockPrisma: DeepMockProxy<PrismaService>;
  let mockR2: jest.Mocked<R2Service>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SongsService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: R2Service, useValue: { getSignedUrl: jest.fn() } },
      ],
    }).compile();

    service = module.get(SongsService);
    mockPrisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create song with correct owner', async () => {
      // Arrange
      const dto = { title: 'Test Song', genre: 'pop' };
      const userId = 'user-123';
      mockPrisma.song.create.mockResolvedValue({ id: 'song-1', ...dto, ownerId: userId });

      // Act
      const result = await service.create(dto, userId);

      // Assert
      expect(result.ownerId).toBe(userId);
      expect(mockPrisma.song.create).toHaveBeenCalledWith({
        data: { ...dto, ownerId: userId },
      });
    });

    it('should throw ForbiddenException when song remix not allowed', async () => {
      // Red test first!
      await expect(service.createRemix(nonRemixSongId, remixerId))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
```

### Key Principles

```typescript
// ✅ Test BEHAVIOR, not implementation
it('should reject remix when remix_allowed is false', ...)

// ❌ Test implementation details
it('should call prisma.song.findUnique once', ...)
```

---

## What to Mock

| Dependency | Mock Strategy |
|-----------|-------------|
| PrismaService | `jest-mock-extended` `mockDeep<PrismaService>()` |
| Redis/BullMQ | `jest.fn()` for queue.add |
| R2Service | `jest.fn()` for getSignedUrl |
| Stripe | `jest.fn()` for stripe.paymentIntents.create |
| External HTTP | `nock` or `jest.mock` |

**NEVER** use real database in unit tests.
**ALWAYS** use real database in integration tests (test database).

---

## Royalty Calculation Tests (Critical)

These tests are CRITICAL. Must be 100% accurate:

```typescript
describe('RoyaltyService.calculateSplit', () => {
  it('should give platform 10% of any revenue', async () => {
    const splits = await royaltyService.calculate('song-id', 10000); // $100.00
    const platformSplit = splits.find(s => s.role === 'platform');
    expect(platformSplit.amount).toBe(1000); // $10.00 = 10%
  });

  it('should split correctly for 2-level remix chain', async () => {
    // Original → Remix A → Remix A1
    // $100 license for Remix A1
    const splits = await royaltyService.calculate('remix-a1-id', 10000);
    
    expect(splits.find(s => s.userId === 'platform').amount).toBe(1000);  // 10%
    expect(splits.find(s => s.userId === 'remixer-a1').amount).toBe(6300); // 63%
    expect(splits.find(s => s.userId === 'remixer-a').amount).toBe(1260);  // 12.6%
    expect(splits.find(s => s.userId === 'original').amount).toBe(360);    // 3.6%
  });
});
```

---

## Coverage Requirements

```
Overall: ≥ 85%
Critical paths (royalty, ownership): ≥ 95%
Auth: ≥ 90%
API handlers: ≥ 80%
```

Run coverage:
```bash
npm test -- --coverage --coverageReporters=text-summary
```

---

## Test File Organization

```
auth-service/
├── src/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts      ← Unit test here
│   └── users/
│       ├── users.service.ts
│       └── users.service.spec.ts
└── test/
    └── auth.e2e-spec.ts              ← Integration test here
```

---

## Integration Test Example

```typescript
// test/songs.e2e-spec.ts
describe('Songs API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Test1234!' });
    authToken = loginRes.body.access_token;
  });

  it('POST /music/songs — should require authentication', async () => {
    const res = await request(app.getHttpServer())
      .post('/music/songs')
      .send({ title: 'Test' });
    expect(res.status).toBe(401);
  });

  it('POST /music/songs — should create song for authenticated creator', async () => {
    const res = await request(app.getHttpServer())
      .post('/music/songs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'My Song', genre: 'pop' });
    expect(res.status).toBe(201);
    expect(res.body.ownerId).toBeDefined();
  });
});
```

---

## Before Marking Any Task Done

```bash
# Run full test suite
npm test

# Check coverage
npm test -- --coverage

# Check lint
npm run lint

# Verify build
npm run build
```

All must pass with **0 failures** before reporting completion.
