import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CharacterList from './pages/CharacterList'
import CharacterForm from './pages/CharacterForm'
import CharacterView from './pages/CharacterView'
import ProtectedRoute from './router/ProtectedRoute'

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/characters"
            element={
              <ProtectedRoute>
                <CharacterList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/characters/new"
            element={
              <ProtectedRoute>
                <CharacterForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/characters/:id"
            element={
              <ProtectedRoute>
                <CharacterView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/characters/:id/edit"
            element={
              <ProtectedRoute>
                <CharacterForm editMode />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
