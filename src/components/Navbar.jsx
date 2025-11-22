import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="nav">
      <div className="nav-left">
        <h1 className="brand">Characters Of Darkness</h1>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/characters">Characters</NavLink>
        </nav>
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="user">{user?.username}</span>
            <button className="btn small" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  )
}
