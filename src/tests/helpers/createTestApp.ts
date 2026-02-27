import express from "express"
import { vi } from "vitest"

/**
 * Creates a test version of the Express app with requireAuth mocked.
 * The injected user is attached to req.user for all requests.
 */
export function createTestApp(user: Record<string, unknown> | null) {
  // Mock requireAuth before importing routes
  vi.mock("@/middlewares/auth.middleware", () => ({
    requireAuth: (req: any, res: any, next: any) => {
      if (!user) {
        return res.status(401).json({ success: false, message: "User is unauthorized." })
      }
      req.user = user
      next()
    },
  }))

  // Import routes AFTER mock is set up
  const SystemRouter = require("@/routes/Systems/system.route").default
  const DepartmentRouter = require("@/routes/Departments/department.route").default
  const RoleRouter = require("@/routes/Roles/role.route").default
  const UserRouter = require("@/routes/Users/userProfile.route").default

  const app = express()
  app.use(express.json())

  app.use("/systems", requireAuthMock(user), SystemRouter)
  app.use("/departments", requireAuthMock(user), DepartmentRouter)
  app.use("/roles", requireAuthMock(user), RoleRouter)
  app.use("/users", requireAuthMock(user), UserRouter)

  return app
}

function requireAuthMock(user: Record<string, unknown> | null) {
  return (req: any, res: any, next: any) => {
    if (!user) {
      return res.status(401).json({ success: false, message: "User is unauthorized." })
    }
    req.user = user
    next()
  }
}