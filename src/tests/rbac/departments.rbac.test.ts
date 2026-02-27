import { describe, it, expect, vi } from "vitest"
import request from "supertest"
import express, { type Request, type Response, type NextFunction } from "express"
import { mockAdmin, mockEmployee } from "../helpers/mockUser"

const DEPARTMENT_ID = "22222222-2222-4222-8222-222222222222"

vi.mock("@/features/Departments/department.service", () => ({
  getCompanyDepartments: vi.fn().mockResolvedValue({ departments: [], total: 0 }),
  getCompanyDepartmentbyId: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID }),
  getInactiveDepartments: vi.fn().mockResolvedValue({ departments: [], total: 0 }),
  createCompanyDepartment: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID, createdAt: new Date() }),
  createManyCompanyDepartment: vi.fn().mockResolvedValue({ count: 1 }),
  updateCompanyDepartment: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID }),
  restoreCompanyDepartment: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID }),
  softDeleteCompanyDepartment: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID }),
  hardDeleteCompanyDepartment: vi.fn().mockResolvedValue({ id: DEPARTMENT_ID }),
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

describe("Departments - unauthenticated", async () => {
  const { default: DepartmentRouter } = await import("@/routes/Departments/department.route")
  const app = buildApp(null)
  app.use("/departments", DepartmentRouter)

  it("GET /departments -> 401", async () => {
    expect((await request(app).get("/departments")).status).toBe(401)
  })
})

describe("Departments - admin", async () => {
  const { default: DepartmentRouter } = await import("@/routes/Departments/department.route")
  const app = buildApp(mockAdmin)
  app.use("/departments", DepartmentRouter)

  it("GET /departments -> 200", async () => { 
    expect((await request(app).get("/departments")).status).toBe(200)
  })

  it("GET /departments/deleted -> 200", async () => {
    expect((await request(app).get("/departments/deleted")).status).toBe(200)
  })

  it("GET /departments/:id -> 200", async () => {
    expect((await request(app).get(`/departments/${DEPARTMENT_ID}`)).status).toBe(200)
  })

  it("POST /departments -> 201", async () => {
    expect(
      (await request(app).post("/departments").send({ name: "HR", description: "Human Resources" })).status
    ).toBe(201)
  })

  it("POST /departments/bulk -> 201", async () => {
    expect(
      (await request(app).post("/departments/bulk").send([{ name: "IT", description: "Tech" }])).status
    ).toBe(201)
  })

  it("PATCH /departments/:id -> 200", async () => {
    expect((await request(app).patch(`/departments/${DEPARTMENT_ID}`).send({ name: "Updated" })).status).toBe(200)
  })

  it("PATCH /departments/:id/restore -> 404", async () => {
    expect((await request(app).patch(`/departments/${DEPARTMENT_ID}/restore`)).status).toBe(404)
  })

  it("DELETE /departments/:id -> 404", async () => {
    expect((await request(app).delete(`/departments/${DEPARTMENT_ID}`)).status).toBe(404)
  })

  it("DELETE /departments/:id/hard -> 410", async () => {
    expect((await request(app).delete(`/departments/${DEPARTMENT_ID}/hard`)).status).toBe(410)
  })
})

describe("Departments - employee", async () => {
  const { default: DepartmentRouter } = await import("@/routes/Departments/department.route")
  const app = buildApp(mockEmployee)
  app.use("/departments", DepartmentRouter)

  it("GET /departments -> 200", async () => {
    expect((await request(app).get("/departments")).status).toBe(200)
  })

  it("GET /departments/deleted -> 403", async () => {
    expect((await request(app).get("/departments/deleted")).status).toBe(403)
  })

  it("GET /departments/:id -> 200", async () => {
    expect((await request(app).get(`/departments/${DEPARTMENT_ID}`)).status).toBe(200)
  })

  it("POST /departments -> 403", async () => {
    expect((await request(app).post("/departments")).status).toBe(403)
  })

  it("POST /departments/bulk -> 403", async () => {
    expect((await request(app).post("/departments/bulk")).status).toBe(403)
  })

  it("PATCH /departments/:id -> 403", async () => {
    expect((await request(app).patch(`/departments/${DEPARTMENT_ID}`)).status).toBe(403)
  })

  it("PATCH /departments/:id/restore -> 403", async () => {
    expect((await request(app).patch(`/departments/${DEPARTMENT_ID}/restore`)).status).toBe(403)
  })

  it("DELETE /departments/:id -> 403", async () => {
    expect((await request(app).delete(`/departments/${DEPARTMENT_ID}`)).status).toBe(403)
  })

  it("DELETE /departments/:id/hard -> 403", async () => {
    expect((await request(app).delete(`/departments/${DEPARTMENT_ID}/hard`)).status).toBe(403)
  })
})
