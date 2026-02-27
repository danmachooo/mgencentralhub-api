import { describe, it, expect, vi } from "vitest"
import request from "supertest"
import express, { type Request, type Response, type NextFunction } from "express"
import { mockAdmin, mockEmployee } from "../helpers/mockUser"

const ROLE_ID = "11111111-1111-4111-8111-111111111111"

vi.mock("@/features/Users/Role/role.service", () => ({
  getActiveUserRoles: vi.fn().mockResolvedValue({ roles: [], total: 0 }),
  getInactiveUserRoles: vi.fn().mockResolvedValue({ roles: [], total: 0 }),
  getActiveUserRoleById: vi.fn().mockResolvedValue({ id: ROLE_ID }),
  createUserRole: vi.fn().mockResolvedValue({ id: ROLE_ID, createdAt: new Date() }),
  createManyUserRoles: vi.fn().mockResolvedValue({ count: 1 }),
  updateUserRole: vi.fn().mockResolvedValue({ id: ROLE_ID }),
  restoreUserRole: vi.fn().mockResolvedValue({ id: ROLE_ID }),
  softDeleteUserRole: vi.fn().mockResolvedValue({ id: ROLE_ID }),
  hardDeleteUserRole: vi.fn().mockResolvedValue({ id: ROLE_ID }),
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

describe("Roles - unauthenticated", async () => {
  const { default: RoleRouter } = await import("@/routes/Roles/role.route")
  const app = buildApp(null)
  app.use("/roles", RoleRouter)

  it("GET /roles -> 401", async () => {
    expect((await request(app).get("/roles")).status).toBe(401)
  })
})

describe("Roles - admin", async () => {
  const { default: RoleRouter } = await import("@/routes/Roles/role.route")
  const app = buildApp(mockAdmin)
  app.use("/roles", RoleRouter)

  it("GET /roles -> 200", async () => {
    expect((await request(app).get("/roles")).status).toBe(200)
  })

  it("GET /roles/inactive -> 200", async () => {
    expect((await request(app).get("/roles/inactive")).status).toBe(200)
  })

  it("GET /roles/:id -> 200", async () => {
    expect((await request(app).get(`/roles/${ROLE_ID}`)).status).toBe(200)
  })

  it("POST /roles -> 201", async () => {
    expect(
      (await request(app).post("/roles").send({ name: "manager", description: "Manager role" })).status
    ).toBe(201)
  })

  it("POST /roles/bulk -> 200", async () => {
    expect(
      (await request(app).post("/roles/bulk").send([{ name: "viewer", description: "View only" }])).status
    ).toBe(200)
  })

  it("PATCH /roles/:id -> 200", async () => {
    expect((await request(app).patch(`/roles/${ROLE_ID}`).send({ name: "updated" })).status).toBe(200)
  })

  it("PATCH /roles/:id/restore -> 200", async () => {
    expect((await request(app).patch(`/roles/${ROLE_ID}/restore`)).status).toBe(200)
  })

  it("DELETE /roles/:id -> 404", async () => {
    expect((await request(app).delete(`/roles/${ROLE_ID}`)).status).toBe(404)
  })

  it("DELETE /roles/:id/hard -> 410", async () => {
    expect((await request(app).delete(`/roles/${ROLE_ID}/hard`)).status).toBe(410)
  })
})

describe("Roles - employee", async () => {
  const { default: RoleRouter } = await import("@/routes/Roles/role.route")
  const app = buildApp(mockEmployee)
  app.use("/roles", RoleRouter)

  it("GET /roles -> 200", async () => {
    expect((await request(app).get("/roles")).status).toBe(200)
  })

  it("GET /roles/inactive -> 200", async () => {
    expect((await request(app).get("/roles/inactive")).status).toBe(200)
  })

  it("GET /roles/:id -> 200", async () => {
    expect((await request(app).get(`/roles/${ROLE_ID}`)).status).toBe(200)
  })

  it("POST /roles -> 201", async () => {
    expect(
      (await request(app).post("/roles").send({ name: "employee-manager", description: "Manager role" })).status
    ).toBe(201)
  })

  it("POST /roles/bulk -> 200", async () => {
    expect(
      (await request(app).post("/roles/bulk").send([{ name: "employee-viewer", description: "View only" }])).status
    ).toBe(200)
  })

  it("PATCH /roles/:id -> 200", async () => {
    expect((await request(app).patch(`/roles/${ROLE_ID}`).send({ name: "updated-employee" })).status).toBe(200)
  })

  it("PATCH /roles/:id/restore -> 200", async () => {
    expect((await request(app).patch(`/roles/${ROLE_ID}/restore`)).status).toBe(200)
  })

  it("DELETE /roles/:id -> 404", async () => {
    expect((await request(app).delete(`/roles/${ROLE_ID}`)).status).toBe(404)
  })

  it("DELETE /roles/:id/hard -> 410", async () => {
    expect((await request(app).delete(`/roles/${ROLE_ID}/hard`)).status).toBe(410)
  })
})
