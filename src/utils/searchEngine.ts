import { ScriptEntry } from '@/data/scripts'
import { AdminConfig } from '@/data/adminDefaults'
import projects from '@/data/projects'
import contraindications from '@/data/contraindications'
import scripts from '@/data/scripts'

export type UnifiedSearchType = 'script' | 'admin-store-expression' | 'admin-promotion' | 'admin-complaint-template'

export interface ProjectContext {
  projectId?: string
  projectName?: string
  category?: string
  relatedContraindicationIds?: string[]
}

export interface UnifiedSearchResult {
  type: UnifiedSearchType
  id: string
  score: number
  entry?: ScriptEntry
  adminConfig?: {
    type: string
    title: string
    content: string
  }
  projectContext?: ProjectContext
  matchedKeywords: string[]
}

export interface SearchResult {
  entry: ScriptEntry
  score: number
  matches: string[]
}

const semanticDictionary: Record<string, string[]> = {
  '疼': ['疼', '疼痛', '怕痛'], '疼不疼': ['疼', '疼痛', '怕痛'], '痛': ['疼', '疼痛', '怕痛'], '痛感': ['疼', '疼痛', '怕痛'], '怕痛': ['疼', '疼痛', '怕痛'],
  '效果': ['效果', '多久见效', '维持时间'], '有没有用': ['效果', '多久见效', '维持时间'], '见效': ['效果', '多久见效', '维持时间'], '多久见效': ['效果', '多久见效', '维持时间'], '保持': ['效果', '多久见效', '维持时间'], '维持时间': ['效果', '多久见效', '维持时间'], '维持': ['效果', '多久见效', '维持时间'],
  '预算': ['预算', '性价比', '便宜'], '便宜': ['预算', '性价比', '便宜'], '性价比': ['预算', '性价比', '便宜'], '多少钱': ['预算', '性价比', '便宜'], '贵': ['预算', '性价比', '便宜'], '几千': ['预算', '性价比', '便宜'], '三千': ['预算', '性价比', '便宜'], '3000': ['预算', '性价比', '便宜'], '3千': ['预算', '性价比', '便宜'],
  '安全': ['安全', '副作用', '过敏'], '副作用': ['安全', '副作用', '过敏'], '过敏': ['安全', '副作用', '过敏'], '危险': ['安全', '副作用', '过敏'], '风险': ['安全', '副作用', '过敏'],
  '恢复期': ['恢复期', '恢复', '术后'], '恢复': ['恢复期', '恢复', '术后'], '多久恢复': ['恢复期', '恢复', '术后'], '肿': ['恢复期', '恢复', '术后'], '淤青': ['恢复期', '恢复', '术后'],
  '热玛吉': ['热玛吉'], '水光': ['水光针'], '水光针': ['水光针'], '肉毒': ['肉毒素'], '肉毒素': ['肉毒素'], '玻尿酸': ['玻尿酸'],
  '皮秒': ['皮秒激光', '皮秒'], '光子': ['光子嫩肤'], '超声刀': ['超声刀'], '线雕': ['线雕提升'], '瘦脸': ['瘦脸针'], '欧星': ['欧星'],
  '抗衰': ['抗衰', '热玛吉', '超声刀', '线雕'], '注射': ['注射', '肉毒素', '玻尿酸', '水光针', '瘦脸针'],
  '光电': ['光电', '热玛吉', '皮秒激光', '光子嫩肤', '超声刀', '欧星']
}

const categoryMapping: Record<string, string[]> = {
  '抗衰': ['抗衰'], '注射': ['注射'], '激光': ['激光'], '光电': ['激光'], '美肤': ['美肤']
}

const categoryContraindications: Record<string, string[]> = {
  '抗衰': ['contra-pregnancy', 'contra-skin-break', 'contra-immune-disease', 'contra-recent-medication', 'contra-scar-constitution'],
  '注射': ['contra-pregnancy', 'contra-skin-break', 'contra-severe-allergy', 'contra-recent-injection'],
  '激光': ['contra-pregnancy', 'contra-skin-break', 'contra-immune-disease', 'contra-recent-medication', 'contra-severe-allergy'],
  '光电': ['contra-pregnancy', 'contra-skin-break', 'contra-immune-disease', 'contra-recent-medication', 'contra-severe-allergy'],
  '美肤': ['contra-pregnancy', 'contra-skin-break', 'contra-severe-allergy']
}

let keywordDictionary: string[] | null = null

function buildKeywordDictionary(): string[] {
  if (keywordDictionary) return keywordDictionary

  const dict = new Set<string>()

  Object.keys(semanticDictionary).forEach(k => dict.add(k))
  Object.values(semanticDictionary).forEach(arr => arr.forEach(v => dict.add(v)))

  projects.forEach(p => dict.add(p.name))

  scripts.forEach(s => s.keywords.forEach(kw => dict.add(kw)))

  Object.keys(categoryMapping).forEach(k => dict.add(k))
  Object.values(categoryMapping).forEach(arr => arr.forEach(v => dict.add(v)))

  const sorted = Array.from(dict).sort((a, b) => b.length - a.length)
  keywordDictionary = sorted
  return sorted
}

function extractChineseTokens(text: string): string[] {
  const dict = buildKeywordDictionary()
  const tokens: string[] = []
  let i = 0

  while (i < text.length) {
    const char = text[i]
    if (!/[\u4e00-\u9fa5]/.test(char)) {
      i++
      continue
    }

    let matched = false
    for (const word of dict) {
      if (text.startsWith(word, i)) {
        tokens.push(word)
        i += word.length
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push(char)
      i++
    }
  }

  return tokens
}

export function expandQuery(query: string): string[] {
  const tokens = new Set<string>()
  const normalized = query.replace(/三千/g, '3000').replace(/3千/g, '3000')
  
  const numberPattern = /\d+/g
  let match
  while ((match = numberPattern.exec(normalized)) !== null) {
    tokens.add(match[0])
  }

  const englishPattern = /[a-zA-Z]+/g
  while ((match = englishPattern.exec(normalized)) !== null) {
    tokens.add(match[0])
  }

  const chineseTokens = extractChineseTokens(normalized)
  chineseTokens.forEach(t => tokens.add(t))

  for (const word of chineseTokens) {
    if (semanticDictionary[word]) {
      semanticDictionary[word].forEach(t => tokens.add(t))
    }
    if (categoryMapping[word]) {
      categoryMapping[word].forEach(t => tokens.add(t))
    }
  }

  for (const project of projects) {
    if (normalized.includes(project.name)) {
      tokens.add(project.name)
    }
  }

  return Array.from(tokens)
}

type WeightedField = { text: string; weight: number; label: string }

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

  const expandedTokens = expandQuery(query)
  const originalTokens = query.trim().split(/\s+/)

  const detectedProjects = projects.filter(p => 
    expandedTokens.some(t => p.name.includes(t) || t.includes(p.name))
  )

  const results: SearchResult[] = []

  for (const entry of scripts) {
    const fields = getWeightedFields(entry)
    let totalScore = 0
    const matchedLabels: string[] = []
    const allText = `${entry.keywords.join(' ')} ${entry.empathy} ${entry.explanation} ${entry.guide} ${entry.category} ${entry.projectRef}`

    for (const token of originalTokens) {
      for (const field of fields) {
        if (field.text === token) {
          totalScore += 5
          if (!matchedLabels.includes(field.label)) matchedLabels.push(field.label)
        } else if (field.text.includes(token)) {
          totalScore += field.weight
          if (!matchedLabels.includes(field.label)) matchedLabels.push(field.label)
        }
      }
    }

    for (const token of expandedTokens) {
      if (originalTokens.includes(token)) continue
      for (const field of fields) {
        if (field.text.includes(token)) {
          totalScore += 1.5
          if (!matchedLabels.includes(field.label)) matchedLabels.push(field.label)
        }
      }
    }

    if (entry.projectRef) {
      const entryProject = projects.find(p => p.id === entry.projectRef)
      if (entryProject) {
        for (const token of expandedTokens) {
          if (entryProject.name.includes(token) || token.includes(entryProject.name)) {
            totalScore += 2
            if (!matchedLabels.includes(`project:${entryProject.name}`)) {
              matchedLabels.push(`project:${entryProject.name}`)
            }
          }
        }
      }
    }

    for (const dp of detectedProjects) {
      if (entry.projectRef === dp.id) {
        totalScore += 4
        if (!matchedLabels.includes(`boost:${dp.name}`)) {
          matchedLabels.push(`boost:${dp.name}`)
        }
      }
      if (allText.includes(dp.name)) {
        totalScore += 2
      }
    }

    if (totalScore > 0) {
      results.push({ entry, score: totalScore, matches: matchedLabels })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results
}

export function buildProjectContext(projectName: string): ProjectContext | undefined {
  const project = projects.find(p => p.name === projectName)
  if (!project) return undefined

  const relatedContra = contraindications
    .filter(c => c.relatedProjects.includes(project.id))
    .map(c => c.id)

  return {
    projectId: project.id,
    projectName: project.name,
    relatedContraindicationIds: relatedContra
  }
}

export function buildCategoryContext(category: string): ProjectContext | undefined {
  const contraIds = categoryContraindications[category]
  if (!contraIds) return undefined

  return {
    projectName: category,
    category,
    relatedContraindicationIds: contraIds
  }
}

export function unifiedSearch(
  query: string,
  scripts: ScriptEntry[],
  adminConfigs: AdminConfig[]
): UnifiedSearchResult[] {
  if (!query.trim()) return []

  const scriptResults = searchScripts(query, scripts)

  const tokens = expandQuery(query)
  const originalTokens = query.trim().split(/\s+/)
  const allTokens = [...new Set([...originalTokens, ...tokens])]

  const searchableTypes: AdminConfig['type'][] = ['store-expression', 'promotion', 'complaint-template']
  const adminResults: UnifiedSearchResult[] = []

  for (const config of adminConfigs) {
    if (!config.active || !searchableTypes.includes(config.type)) continue

    let score = 0
    const matchedKeywords: string[] = []

    for (const token of allTokens) {
      if (config.title.toLowerCase().includes(token.toLowerCase())) {
        score += 3
        if (!matchedKeywords.includes(token)) matchedKeywords.push(token)
      }
      if (config.content.toLowerCase().includes(token.toLowerCase())) {
        score += 1
        if (!matchedKeywords.includes(token)) matchedKeywords.push(token)
      }
    }

    if (score > 0) {
      let type: UnifiedSearchType
      if (config.type === 'store-expression') type = 'admin-store-expression'
      else if (config.type === 'promotion') type = 'admin-promotion'
      else type = 'admin-complaint-template'

      adminResults.push({
        type,
        id: config.id,
        score,
        adminConfig: {
          type: config.type,
          title: config.title,
          content: config.content,
        },
        matchedKeywords,
      })
    }
  }

  const mappedScriptResults: UnifiedSearchResult[] = scriptResults.map(r => {
  const detectedProjectName = projects.find(p => r.entry.projectRef === p.id)?.name
  let projectContext: ProjectContext | undefined
  if (detectedProjectName) {
    projectContext = buildProjectContext(detectedProjectName)
  } else if (r.entry.category && categoryContraindications[r.entry.category]) {
    projectContext = buildCategoryContext(r.entry.category)
  }
  return {
    type: 'script' as const,
    id: r.entry.id,
    score: r.score,
    entry: r.entry,
    matchedKeywords: r.matches,
    projectContext,
  }
})

  const allResults = [...mappedScriptResults, ...adminResults]
  allResults.sort((a, b) => b.score - a.score)

  return allResults
}
