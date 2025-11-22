import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CharacterService } from '../services/characterService'

export default function CharacterForm({ editMode }) {
  const params = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    // Vampire: The Masquerade fields
    name: '',
    clan: '',
    generation: '',
    nature: '',
    demeanor: '',
    willpower: 1,
    bloodPool: 0,
    hunger: 0,
    attributes: {
      physical: { strength: 1, dexterity: 1, stamina: 1 },
      social: { charisma: 1, manipulation: 1, appearance: 1 },
      mental: { perception: 1, intelligence: 1, wits: 1 },
    },
    disciplinesText: '', // simple textarea representation Discipline:level, ...
    backgroundsText: '', // Background:level, ...
    virtues: { conscience: 1, selfControl: 1, courage: 1 },
    notes: '',
  })

  useEffect(() => {
    if (params.id) {
      const c = CharacterService.getById(params.id)
      if (c) {
        // normalize existing character into form shape
        const stats = c.stats || {}
        const attributesFromStats = {
          physical: { strength: stats.str || 1, dexterity: stats.dex || 1, stamina: stats.con || 1 },
          social: { charisma: stats.cha || 1, manipulation: 1, appearance: 1 },
          mental: { perception: stats.wis || 1, intelligence: stats.int || 1, wits: 1 },
        }

        const normalized = {
          name: c.name || '',
          clan: c.clan || '',
          generation: c.generation || '',
          nature: c.nature || '',
          demeanor: c.demeanor || '',
          willpower: c.willpower ?? 1,
          bloodPool: c.bloodPool ?? 0,
          hunger: c.hunger ?? 0,
          attributes: c.attributes || attributesFromStats,
          disciplinesText: c.disciplines ? Object.entries(c.disciplines).map(([k,v]) => `${k}:${v}`).join(', ') : '',
          backgroundsText: c.backgrounds ? Object.entries(c.backgrounds).map(([k,v]) => `${k}:${v}`).join(', ') : '',
          virtues: Object.assign({ conscience: 1, selfControl: 1, courage: 1 }, c.virtues || {}),
          notes: c.notes || '',
        }
        setForm(normalized)
      }
    }
  }, [params.id])

  function updateField(path, value) {
    // nested attributes: attributes.physical.strength etc.
    if (path.startsWith('attributes.')) {
      const [, group, key] = path.split('.')
      setForm((f) => ({ ...f, attributes: { ...f.attributes, [group]: { ...f.attributes[group], [key]: Number(value) } } }))
      return
    }
    if (path.startsWith('virtues.')) {
      const key = path.split('.')[1]
      setForm((f) => ({ ...f, virtues: { ...f.virtues, [key]: Number(value) } }))
      return
    }
    setForm((f) => ({ ...f, [path]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // parse disciplinesText and backgroundsText into objects
    const disciplines = {}
    if (form.disciplinesText) {
      form.disciplinesText.split(',').forEach((entry) => {
        const [k, v] = entry.split(':').map((s) => s && s.trim())
        if (k) disciplines[k] = Number(v || 1)
      })
    }
    const backgrounds = {}
    if (form.backgroundsText) {
      form.backgroundsText.split(',').forEach((entry) => {
        const [k, v] = entry.split(':').map((s) => s && s.trim())
        if (k) backgrounds[k] = Number(v || 1)
      })
    }

    const payload = {
      ...form,
      disciplines,
      backgrounds,
    }

    if (params.id) {
      CharacterService.update(params.id, payload)
      navigate(`/characters/${params.id}`)
    } else {
      const created = CharacterService.create(payload)
      navigate(`/characters/${created.id}`)
    }
  }

  return (
    <div className="card">
      <h2>{params.id ? 'Edit Character' : 'New Character'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
        </label>

        <label>
          Clan
          <input value={form.clan} onChange={(e) => updateField('clan', e.target.value)} />
        </label>

        <label>
          Generation
          <input value={form.generation} onChange={(e) => updateField('generation', e.target.value)} />
        </label>

        <label>
          Nature
          <input value={form.nature} onChange={(e) => updateField('nature', e.target.value)} />
        </label>

        <label>
          Demeanor
          <input value={form.demeanor} onChange={(e) => updateField('demeanor', e.target.value)} />
        </label>

        <label>
          Willpower
          <input type="number" min="0" value={form.willpower} onChange={(e) => updateField('willpower', Number(e.target.value))} />
        </label>

        <label>
          Blood Pool
          <input type="number" min="0" value={form.bloodPool} onChange={(e) => updateField('bloodPool', Number(e.target.value))} />
        </label>

        <label>
          Hunger
          <input type="number" min="0" value={form.hunger} onChange={(e) => updateField('hunger', Number(e.target.value))} />
        </label>

        <fieldset>
          <legend>Attributes — Physical</legend>
          {Object.entries(form.attributes.physical).map(([k, v]) => (
            <label key={k} className="stat">
              {k.toUpperCase()}
              <input type="number" min="1" max="5" value={v} onChange={(e) => updateField(`attributes.physical.${k}`, e.target.value)} />
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Attributes — Social</legend>
          {Object.entries(form.attributes.social).map(([k, v]) => (
            <label key={k} className="stat">
              {k.toUpperCase()}
              <input type="number" min="1" max="5" value={v} onChange={(e) => updateField(`attributes.social.${k}`, e.target.value)} />
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Attributes — Mental</legend>
          {Object.entries(form.attributes.mental).map(([k, v]) => (
            <label key={k} className="stat">
              {k.toUpperCase()}
              <input type="number" min="1" max="5" value={v} onChange={(e) => updateField(`attributes.mental.${k}`, e.target.value)} />
            </label>
          ))}
        </fieldset>

        <label>
          Disciplines (format: Discipline:level, ...)
          <input value={form.disciplinesText} onChange={(e) => updateField('disciplinesText', e.target.value)} placeholder="Celerity:2, Dominate:1" />
        </label>

        <label>
          Backgrounds (format: Background:level, ...)
          <input value={form.backgroundsText} onChange={(e) => updateField('backgroundsText', e.target.value)} placeholder="Resources:2, Allies:1" />
        </label>

        <fieldset>
          <legend>Virtues</legend>
          {Object.entries(form.virtues).map(([k, v]) => (
            <label key={k} className="stat">
              {k}
              <input type="number" min="1" max="5" value={v} onChange={(e) => updateField(`virtues.${k}`, e.target.value)} />
            </label>
          ))}
        </fieldset>

        <label>
          Notes / Merits & Flaws
          <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} />
        </label>

        <div className="actions">
          <button className="btn">Save</button>
        </div>
      </form>
    </div>
  )
}
