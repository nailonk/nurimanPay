import { createContext, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (role) => {
    setUser({ role })
    localStorage.setItem("role", role)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("role")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}