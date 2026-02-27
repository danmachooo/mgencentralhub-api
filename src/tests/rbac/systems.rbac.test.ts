import { describe, it, expect, vi } from "vitest"
import request from "supertest"
import express, { type Request, type Response, type NextFunction } from "express"
import { mockAdmin, mockEmployee } from "../helpers/mockUser"

const SYSTEM_ID = "33333333-3333-4333-8333-333333333333"
const STATUS_ID = "44444444-4444-4444-8444-444444444444"

vi.mock("@/features/Systems/system.service", () => ({
  getCompanySystems: vi.fn().mockResolvedValue({ systems: [], total: 0 }),
  getCompanySystemById: vi.fn().mockResolvedValue({ system: { id: SYSTEM_ID, image: null } }),
  getDeletedCompanySystems: vi.fn(async (_req?: unknown, res?: Response) => {
    if (res) {
      return res.status(200).json({
        success: true,
        message: "Systems retrieved successfully",
        data: { systems: [], total: 0 },
      })
    }
    return { deleted: [], total: 0 }
  }),
  createCompanySystem: vi.fn().mockResolvedValue({ id: SYSTEM_ID, createdAt: new Date() }),
  updateCompanySystem: vi.fn().mockResolvedValue({ id: SYSTEM_ID, updatedAt: new Date() }),
  restoreCompanySystem: vi.fn().mockResolvedValue({ restored: { id: SYSTEM_ID } }),
  softDeleteCompanySystem: vi.fn().mockResolvedValue({ id: SYSTEM_ID }),
  hardDeleteCompanySystem: vi.fn().mockResolvedValue({ id: SYSTEM_ID }),
}))

vi.mock("@/features/Systems/PersonalSystems/personalSystem.service", () => ({
  getPersonalSystems: vi.fn().mockResolvedValue({ systems: [], total: 0 }),
  getPersonalSystemById: vi.fn().mockResolvedValue({ id: "ps-1", image: null }),
  getDeletedPersonalSystems: vi.fn().mockResolvedValue({ systems: [], total: 0 }),
  createPersonalSystem: vi.fn().mockResolvedValue({ id: "ps-1", createdAt: new Date() }),
  updatePersonalSystem: vi.fn().mockResolvedValue({ id: "ps-1" }),
  restorePersonalSystem: vi.fn().mockResolvedValue({ id: "ps-1" }),
  softDeletePersonalSystem: vi.fn().mockResolvedValue({ id: "ps-1" }),
  hardDeletePersonalSystem: vi.fn().mockResolvedValue({ id: "ps-1" }),
}))

vi.mock("@/features/Systems/SystemFlags/systemFlag.service", () => ({
  getActiveSystemFlags: vi.fn().mockResolvedValue({ flags: [], total: 0 }),
  getInactiveSystemFlags: vi.fn().mockResolvedValue({ flags: [], total: 0 }),
  getActiveSystemFlagById: vi.fn().mockResolvedValue({ id: "flag-1" }),
  createSystemFlag: vi.fn().mockResolvedValue({ id: "flag-1", createdAt: new Date() }),
  createManySystemFlags: vi.fn().mockResolvedValue({ count: 1 }),
  updateSystemFlag: vi.fn().mockResolvedValue({ id: "flag-1" }),
  restoreSystemFlag: vi.fn().mockResolvedValue({ id: "flag-1" }),
  softDeleteSystemFlag: vi.fn().mockResolvedValue({ id: "flag-1" }),
  hardDeleteSystemFlag: vi.fn().mockResolvedValue({ id: "flag-1" }),
}))

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

function buildApp(user: typeof mockAdmin | typeof mockEmployee | null) {
  const app = express()
  app.use(express.json())
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized." })
    ;(req as any).user = user
    next()
  })
  return app
}

describe("Systems - unauthenticated", async () => {
  const { default: SystemRouter } = await import("@/routes/Systems/system.route")
  const app = buildApp(null)
  app.use("/systems", SystemRouter)

  it("GET /systems -> 401", async () => {
    expect((await request(app).get("/systems")).status).toBe(401)
  })

  it("POST /systems -> 401", async () => {
    expect((await request(app).post("/systems")).status).toBe(401)
  })
})

describe("Systems - admin", async () => {
  const { default: SystemRouter } = await import("@/routes/Systems/system.route")
  const app = buildApp(mockAdmin)
  app.use("/systems", SystemRouter)

  it("GET /systems -> 200", async () => {
    expect((await request(app).get("/systems")).status).toBe(200)
  })

  it("GET /systems/deleted -> 200", async () => {
    expect((await request(app).get("/systems/deleted")).status).toBe(200)
  })

  it("GET /systems/:id -> 200", async () => {
    expect((await request(app).get(`/systems/${SYSTEM_ID}`)).status).toBe(200)
  })

  it("POST /systems -> 201", async () => {
    expect(
      (
        await request(app)
          .post("/systems")
          .field("name", "Test")
          .field("description", "desc")
          .field("url", "https://test.com")
          .field("statusId", STATUS_ID)
      ).status
    ).toBe(201)
  })

  it("PATCH /systems/:id -> 200", async () => {
    expect((await request(app).patch(`/systems/${SYSTEM_ID}`).send({ name: "Updated" })).status).toBe(200)
  })

  it("PATCH /systems/:id/restore -> 200", async () => {
    expect((await request(app).patch(`/systems/${SYSTEM_ID}/restore`)).status).toBe(200)
  })

  it("DELETE /systems/:id -> 404", async () => {
    expect((await request(app).delete(`/systems/${SYSTEM_ID}`)).status).toBe(404)
  })

  it("DELETE /systems/:id/hard -> 410", async () => {
    expect((await request(app).delete(`/systems/${SYSTEM_ID}/hard`)).status).toBe(410)
  })
})

describe("Systems - employee", async () => {
  const { default: SystemRouter } = await import("@/routes/Systems/system.route")
  const app = buildApp(mockEmployee)
  app.use("/systems", SystemRouter)

  it("GET /systems -> 200", async () => {
    expect((await request(app).get("/systems")).status).toBe(200)
  })

  it("GET /systems/deleted -> 403", async () => {
    expect((await request(app).get("/systems/deleted")).status).toBe(403)
  })

  it("GET /systems/:id -> 200", async () => {
    expect((await request(app).get(`/systems/${SYSTEM_ID}`)).status).toBe(200)
  })

  it("POST /systems -> 403", async () => {
    expect((await request(app).post("/systems")).status).toBe(403)
  })

  it("PATCH /systems/:id -> 403", async () => {
    expect((await request(app).patch(`/systems/${SYSTEM_ID}`)).status).toBe(403)
  })

  it("PATCH /systems/:id/restore -> 403", async () => {
    expect((await request(app).patch(`/systems/${SYSTEM_ID}/restore`)).status).toBe(403)
  })

  it("DELETE /systems/:id -> 403", async () => {
    expect((await request(app).delete(`/systems/${SYSTEM_ID}`)).status).toBe(403)
  })

  it("DELETE /systems/:id/hard -> 403", async () => {
    expect((await request(app).delete(`/systems/${SYSTEM_ID}/hard`)).status).toBe(403)
  })
})
