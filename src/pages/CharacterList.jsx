import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CharacterService } from '../services/characterService'

export default function CharacterList() {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  function refresh() {
    setList(CharacterService.getAll())
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleDelete(id) {
    if (!confirm('Delete this character?')) return
    CharacterService.remove(id)
    refresh()
  }

  return (
    <div className="card">
      <div className="list-header">
        <h2>Characters</h2>
        <div>
          <button className="btn" onClick={() => navigate('/characters/new')}>
            New Character
          </button>
          <button className="btn small" style={{ marginLeft: '0.5rem' }} onClick={refresh}>Refresh</button>
        </div>
      </div>
      {list.length === 0 ? (
        <p>No characters yet. Create one from New Character.</p>
      ) : (
        <ul className="character-list">
          {list.map((c) => (
            <li key={c.id} className="character-item">
              <div>
                <strong>{c.name}</strong>
                <div className="muted">{c.clan || ''} {c.generation ? `• Gen ${c.generation}` : ''}</div>
              </div>
              <div className="actions">
                <Link to={`/characters/${c.id}`} className="link">View</Link>
                <Link to={`/characters/${c.id}/edit`} className="link">Edit</Link>
                <button className="btn small" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
