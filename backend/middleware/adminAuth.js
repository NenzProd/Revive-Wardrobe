import jwt from "jsonwebtoken"

const LEGACY_ADMIN_TOKEN = `${process.env.ADMIN_EMAIL || ""}${process.env.ADMIN_PASSWORD || ""}`

const normalizeRole = (role) =>
  typeof role === "string" && role.trim() ? role.trim() : "super_admin"

const normalizeAllowedRoles = (roles) =>
  Array.isArray(roles)
    ? roles.filter(Boolean).map((role) => role.trim())
    : []

const buildAdminFromDecodedToken = (decoded) => {
  if (typeof decoded === "string") {
    if (decoded === LEGACY_ADMIN_TOKEN) {
      return { email: process.env.ADMIN_EMAIL || "admin@local", role: "super_admin" }
    }
    return null
  }

  if (decoded && typeof decoded === "object") {
    const email = decoded.email || process.env.ADMIN_EMAIL || "admin@local"
    const role = normalizeRole(decoded.role)
    return { email, role }
  }

  return null
}

const authorizeAdmin = (allowedRoles = []) => async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: "Not authorized login again" })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const admin = buildAdminFromDecodedToken(decodedToken)
    if (!admin) {
      return res.json({ success: false, message: "Not authorized login again" })
    }

    const roles = normalizeAllowedRoles(allowedRoles)
    if (roles.length > 0 && !roles.includes(admin.role)) {
      return res.json({ success: false, message: "Insufficient permissions for this action" })
    }

    req.admin = admin
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const adminAuth = authorizeAdmin()

export { authorizeAdmin }
export default adminAuth
