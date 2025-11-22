// Object-oriented Character service using localStorage
// Vampire: The Masquerade focused Character model (World of Darkness)
class Character {
  constructor(data = {}) {
    // basic metadata
    this.id = data.id || Date.now().toString()
    this.name = data.name || 'Unnamed'
    this.player = data.player || ''
    this.chronicle = data.chronicle || ''
    this.clan = data.clan || ''
    this.generation = data.generation || ''
    this.sire = data.sire || ''
    this.nature = data.nature || ''
    this.demeanor = data.demeanor || ''

    // core vampire stats
    this.willpower = data.willpower ?? 1
    this.hunger = data.hunger ?? 0
    this.bloodPool = data.bloodPool ?? 0
    this.humanity = data.humanity ?? null

    // Attributes grouped as in WoD: physical, social, mental
    this.attributes = Object.assign(
      {
        physical: { strength: 1, dexterity: 1, stamina: 1 },
        social: { charisma: 1, manipulation: 1, appearance: 1 },
        mental: { perception: 1, intelligence: 1, wits: 1 },
      },
      data.attributes || {}
    )

    // Skills / Talents / Knowledges - keep as flat map
    this.skills = data.skills || {}

    // Disciplines (vampiric powers): map of discipline -> level
    this.disciplines = data.disciplines || {}

    // Backgrounds, virtues, merits/flaws
    this.backgrounds = data.backgrounds || {}
    this.virtues = Object.assign({ conscience: 1, selfControl: 1, courage: 1 }, data.virtues || {})
    this.merits = data.merits || []
    this.flaws = data.flaws || []

    // health and notes
    this.health = data.health || { levels: [] }
    this.notes = data.notes || ''
  }
}

class CharacterService {
  static STORAGE_KEY = 'cod_characters'

  static _read() {
    const raw = localStorage.getItem(this.STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  static _write(list) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list))
  }

  static getAll() {
    return this._read()
  }

  static getById(id) {
    return this._read().find((c) => c.id === id) || null
  }

  static create(data) {
    const c = new Character(data)
    const list = this._read()
    list.push(c)
    this._write(list)
    return c
  }

  static update(id, data) {
    const list = this._read()
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) return null
    const updated = Object.assign({}, list[idx], data)
    list[idx] = updated
    this._write(list)
    return updated
  }

  static remove(id) {
    const list = this._read().filter((c) => c.id !== id)
    this._write(list)
  }
}

export { CharacterService, Character }
