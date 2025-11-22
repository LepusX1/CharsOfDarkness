import { useParams, Link } from 'react-router-dom'
import { CharacterService } from '../services/characterService'

export default function CharacterView() {
  const { id } = useParams()
  const c = CharacterService.getById(id)

  if (!c) return <div className="card"><h2>Character not found</h2></div>

  return (
    <div className="card">
      <div className="view-header">
        <h2>{c.name} {c.clan ? `— ${c.clan}` : ''}</h2>
        <div>
          <Link to={`/characters/${c.id}/edit`} className="link">Edit</Link>
          <Link to="/characters" className="link">Back</Link>
        </div>
      </div>

      <p className="muted">Generation: {c.generation || '—'} • Nature: {c.nature || '—'} • Demeanor: {c.demeanor || '—'}</p>

      <section className="stats">
        <div style={{ flex: 1 }}>
          <h4>Physical</h4>
          {Object.entries(c.attributes.physical).map(([k, v]) => (
            <div key={k} className="stat-box">
              <div className="stat-key">{k.toUpperCase()}</div>
              <div className="stat-val">{v}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <h4>Social</h4>
          {Object.entries(c.attributes.social).map(([k, v]) => (
            <div key={k} className="stat-box">
              <div className="stat-key">{k.toUpperCase()}</div>
              <div className="stat-val">{v}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <h4>Mental</h4>
          {Object.entries(c.attributes.mental).map(([k, v]) => (
            <div key={k} className="stat-box">
              <div className="stat-key">{k.toUpperCase()}</div>
              <div className="stat-val">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Disciplines</h3>
        <p className="muted">{Object.keys(c.disciplines || {}).length ? Object.entries(c.disciplines).map(([k,v]) => `${k}(${v})`).join(', ') : '—'}</p>
      </section>

      <section>
        <h3>Backgrounds</h3>
        <p className="muted">{Object.keys(c.backgrounds || {}).length ? Object.entries(c.backgrounds).map(([k,v]) => `${k}(${v})`).join(', ') : '—'}</p>
      </section>

      <section>
        <h3>Notes</h3>
        <p className="notes">{c.notes || '—'}</p>
      </section>
    </div>
  )
}
