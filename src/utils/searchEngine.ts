import { ScriptEntry } from '@/data/scripts'

export interface SearchResult {
  entry: ScriptEntry
  score: number
  matches: string[]
}

type WeightedField = {
  text: string
  weight: number
  label: string
}

function getWeightedFields(entry: ScriptEntry): WeightedField[] {
  return [
    ...entry.keywords.map(kw => ({ text: kw, weight: 3, label: `keyword:${kw}` })),
    { text: entry.empathy, weight: 1, label: 'empathy' },
    { text: entry.explanation, weight: 1, label: 'explanation' },
    { text: entry.guide, weight: 1, label: 'guide' },
    { text: entry.category, weight: 2, label: `category:${entry.category}` },
    { text: entry.projectRef, weight: 2, label: `projectRef:${entry.projectRef}` },
  ]
}

export function searchScripts(query: string, scripts: ScriptEntry[]): SearchResult[] {
  if (!query.trim()) return []

  const tokens = query.trim().split(/\s+/)

  const results: SearchResult[] = []

  for (const entry of scripts) {
    const fields = getWeightedFields(entry)
    let totalScore = 0
    const matchedLabels: string[] = []

    for (const token of tokens) {
      for (const field of fields) {
        if (field.text.includes(token)) {
          totalScore += field.weight
          if (!matchedLabels.includes(field.label)) {
            matchedLabels.push(field.label)
          }
        }
      }
    }

    if (totalScore > 0) {
      results.push({ entry, score: totalScore, matches: matchedLabels })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results
}
