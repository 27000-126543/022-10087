import { create } from 'zustand'
import { ScriptEntry, defaultScripts } from '@/data/scripts'

interface ScriptState {
  scripts: ScriptEntry[]
  searchQuery: string
  searchResults: ScriptEntry[]
  setSearchQuery: (query: string) => void
  searchScripts: (query: string) => void
  getScriptById: (id: string) => ScriptEntry | undefined
}

function fuzzyMatch(text: string, query: string): number {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  if (!q) return 0
  if (lower === q) return 100
  if (lower.startsWith(q)) return 80
  if (lower.includes(q)) return 60

  let score = 0
  let qi = 0
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      score += 10
      qi++
    }
  }
  return qi === q.length ? score : 0
}

function computeRelevance(entry: ScriptEntry, query: string): number {
  let total = 0
  for (const kw of entry.keywords) {
    total += fuzzyMatch(kw, query)
  }
  total += fuzzyMatch(entry.empathy, query)
  total += fuzzyMatch(entry.explanation, query)
  total += fuzzyMatch(entry.guide, query)
  return total
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: defaultScripts,
  searchQuery: '',
  searchResults: [],

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (!query.trim()) {
      set({ searchResults: [] })
      return
    }
    get().searchScripts(query)
  },

  searchScripts: (query) => {
    if (!query.trim()) {
      set({ searchResults: [] })
      return
    }
    const results = get().scripts
      .map((entry) => ({ entry, score: computeRelevance(entry, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ entry }) => entry)
    set({ searchResults: results })
  },

  getScriptById: (id) => {
    return get().scripts.find((s) => s.id === id)
  },
}))
