import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Simple OO-style AuthService that persists a "user" in localStorage
class AuthService {
  static STORAGE_KEY = 'cod_user'

  static signup({ username, password }) {
    // naive simulation: save user object
    const user = { username }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    return user
  }

  static login({ username, password }) {
    // accept any credentials for now
    const user = { username }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    return user
  }

  static logout() {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static current() {
    const raw = localStorage.getItem(this.STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(AuthService.current())
  const navigate = useNavigate()

  useEffect(() => {
    setUser(AuthService.current())
  }, [])

  const signup = (creds) => {
    const u = AuthService.signup(creds)
    setUser(u)
    return u
  }

  const login = (creds) => {
    const u = AuthService.login(creds)
    setUser(u)
    return u
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
