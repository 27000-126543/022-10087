import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ScriptEntry, defaultScripts } from '@/data/scripts'
import { UnifiedSearchResult, unifiedSearch as performUnifiedSearch } from '@/utils/searchEngine'
import { useAdminStore } from '@/store/adminStore'

export type { UnifiedSearchResult }

export interface RecentSearch {
  query: string
  count: number
  lastUsed: number
}

interface ScriptState {
  scripts: ScriptEntry[]
  searchQuery: string
  searchResults: ScriptEntry[]
  unifiedSearchQuery: string
  unifiedSearchResults: UnifiedSearchResult[]
  recentSearches: RecentSearch[]
  setSearchQuery: (query: string) => void
  searchScripts: (query: string) => void
  getScriptById: (id: string) => ScriptEntry | undefined
  setUnifiedSearchQuery: (query: string) => void
  unifiedSearch: (query: string) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
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

export const useScriptStore = create<ScriptState>()(
  persist(
    (set, get) => ({
      scripts: defaultScripts,
      searchQuery: '',
      searchResults: [],
      unifiedSearchQuery: '',
      unifiedSearchResults: [],
      recentSearches: [],

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

      setUnifiedSearchQuery: (query) => {
        set({ unifiedSearchQuery: query })
        if (!query.trim()) {
          set({ unifiedSearchResults: [] })
          return
        }
        get().unifiedSearch(query)
      },

      unifiedSearch: (query) => {
        set({ unifiedSearchQuery: query })
        if (!query.trim()) {
          set({ unifiedSearchResults: [] })
          return
        }
        const adminConfigs = useAdminStore.getState().configs
        const results = performUnifiedSearch(query, get().scripts, adminConfigs)
        set({ unifiedSearchResults: results })
      },

      addRecentSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return
        const existing = get().recentSearches
        const idx = existing.findIndex(r => r.query === trimmed)
        let updated: RecentSearch[]
        if (idx >= 0) {
          updated = existing.map((r, i) =>
            i === idx ? { ...r, count: r.count + 1, lastUsed: Date.now() } : r
          )
        } else {
          updated = [...existing, { query: trimmed, count: 1, lastUsed: Date.now() }]
        }
        updated.sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed)
        set({ recentSearches: updated.slice(0, 8) })
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] })
      },
    }),
    {
      name: 'medical-beauty-scripts',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
)
