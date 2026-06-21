import type { ScriptEntry } from '@/data/scripts'
import type { AdminConfig } from '@/data/adminDefaults'
import projects from '@/data/projects'
import contraindications from '@/data/contraindications'
import scriptsData from '@/data/scripts'

export type UnifiedSearchType = 'script' | 'admin-store-expression' | 'admin-promotion' | 'admin-complaint-template'

export interface ProjectContext {
  projectId?: string
  projectName?: string
  category?: string
  relatedContraindicationIds: string[]
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
    scenes?: string[]
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

let keywordDictionaryCache: string[] | null = null

function buildKeywordDictionary(): string[] {
  if (keywordDictionaryCache) return keywordDictionaryCache

  const dict = new Set<string>()

  try {
    Object.keys(semanticDictionary).forEach(k => { if (k) dict.add(k) })
    Object.values(semanticDictionary).forEach(arr => arr.forEach(v => { if (v) dict.add(v) }))

    if (Array.isArray(projects)) {
      projects.forEach(p => { if (p?.name) dict.add(p.name) })
    }

    if (Array.isArray(scriptsData)) {
      scriptsData.forEach(s => {
        if (Array.isArray(s?.keywords)) {
          s.keywords.forEach(kw => { if (kw) dict.add(kw) })
        }
      })
    }

    Object.keys(categoryMapping).forEach(k => { if (k) dict.add(k) })
    Object.values(categoryMapping).forEach(arr => arr.forEach(v => { if (v) dict.add(v) }))
  } catch (e) {
    console.warn('buildKeywordDictionary warning:', e)
  }

  const sorted = Array.from(dict).filter(w => w && w.length > 0).sort((a, b) => b.length - a.length)
  keywordDictionaryCache = sorted
  return sorted
}

function extractChineseTokens(text: string): string[] {
  const tokens: string[] = []
  if (!text) return tokens

  try {
    const dict = buildKeywordDictionary()
    let i = 0

    while (i < text.length) {
      const char = text[i]
      if (!char || !/[\u4e00-\u9fa5]/.test(char)) {
        i++
        continue
      }

      let matched = false
      for (const word of dict) {
        if (!word) continue
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
  } catch (e) {
    console.warn('extractChineseTokens warning:', e)
  }

  return tokens
}

export function expandQuery(query: string): string[] {
  const tokens = new Set<string>()
  if (!query) return []

  try {
    const normalized = query.replace(/三千/g, '3000').replace(/3千/g, '3000')

    const numberPattern = /\d+/g
    let match: RegExpExecArray | null
    while ((match = numberPattern.exec(normalized)) !== null) {
      if (match[0]) tokens.add(match[0])
    }

    const englishPattern = /[a-zA-Z]+/g
    while ((match = englishPattern.exec(normalized)) !== null) {
      if (match[0]) tokens.add(match[0])
    }

    const chineseTokens = extractChineseTokens(normalized)
    chineseTokens.forEach(t => { if (t) tokens.add(t) })

    for (const word of chineseTokens) {
      if (!word) continue
      if (semanticDictionary[word]) {
        semanticDictionary[word].forEach(t => { if (t) tokens.add(t) })
      }
      if (categoryMapping[word]) {
        categoryMapping[word].forEach(t => { if (t) tokens.add(t) })
      }
    }

    if (Array.isArray(projects)) {
      for (const project of projects) {
        if (project?.name && normalized.includes(project.name)) {
          tokens.add(project.name)
        }
      }
    }
  } catch (e) {
    console.warn('expandQuery warning:', e)
  }

  return Array.from(tokens)
}

type WeightedField = { text: string; weight: number; label: string }

function getWeightedFields(entry: ScriptEntry): WeightedField[] {
  const fields: WeightedField[] = []
  try {
    if (Array.isArray(entry.keywords)) {
      entry.keywords.forEach(kw => {
        if (kw) fields.push({ text: kw, weight: 3, label: `keyword:${kw}` })
      })
    }
    if (entry.empathy) fields.push({ text: entry.empathy, weight: 1, label: 'empathy' })
    if (entry.explanation) fields.push({ text: entry.explanation, weight: 1, label: 'explanation' })
    if (entry.guide) fields.push({ text: entry.guide, weight: 1, label: 'guide' })
    if (entry.category) fields.push({ text: entry.category, weight: 2, label: `category:${entry.category}` })
    if (entry.projectRef) fields.push({ text: entry.projectRef, weight: 2, label: `projectRef:${entry.projectRef}` })
  } catch (e) {
    console.warn('getWeightedFields warning:', e)
  }
  return fields
}

export function searchScripts(query: string, scriptsList: ScriptEntry[]): SearchResult[] {
  if (!query || !query.trim() || !Array.isArray(scriptsList)) return []

  try {
    const expandedTokens = expandQuery(query)
    const originalTokens = query.trim().split(/\s+/).filter(t => t)

    const detectedProjects = Array.isArray(projects) ? projects.filter(p => {
      if (!p?.name) return false
      return expandedTokens.some(t => t && (p.name.includes(t) || t.includes(p.name)))
    }) : []

    const results: SearchResult[] = []

    for (const entry of scriptsList) {
      if (!entry) continue
      const fields = getWeightedFields(entry)
      let totalScore = 0
      const matchedLabels: string[] = []
      const kwText = Array.isArray(entry.keywords) ? entry.keywords.join(' ') : ''
      const allText = `${kwText} ${entry.empathy || ''} ${entry.explanation || ''} ${entry.guide || ''} ${entry.category || ''} ${entry.projectRef || ''}`

      for (const token of originalTokens) {
        if (!token) continue
        for (const field of fields) {
          if (!field?.text) continue
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
        if (!token || originalTokens.includes(token)) continue
        for (const field of fields) {
          if (!field?.text) continue
          if (field.text.includes(token)) {
            totalScore += 1.5
            if (!matchedLabels.includes(field.label)) matchedLabels.push(field.label)
          }
        }
      }

      if (entry.projectRef && Array.isArray(projects)) {
        const entryProject = projects.find(p => p?.id === entry.projectRef)
        if (entryProject?.name) {
          for (const token of expandedTokens) {
            if (!token) continue
            if (entryProject.name.includes(token) || token.includes(entryProject.name)) {
              totalScore += 2
              const label = `project:${entryProject.name}`
              if (!matchedLabels.includes(label)) matchedLabels.push(label)
            }
          }
        }
      }

      for (const dp of detectedProjects) {
        if (!dp?.id) continue
        if (entry.projectRef === dp.id) {
          totalScore += 4
          const label = `boost:${dp.name}`
          if (!matchedLabels.includes(label)) matchedLabels.push(label)
        }
        if (dp.name && allText.includes(dp.name)) {
          totalScore += 2
        }
      }

      if (totalScore > 0) {
        results.push({ entry, score: totalScore, matches: matchedLabels })
      }
    }

    results.sort((a, b) => b.score - a.score)
    return results
  } catch (e) {
    console.error('searchScripts error:', e)
    return []
  }
}

export function buildProjectContext(projectName: string): ProjectContext | undefined {
  try {
    if (!Array.isArray(projects) || !projectName) return undefined
    const project = projects.find(p => p?.name === projectName)
    if (!project) return undefined

    const relatedContra = Array.isArray(contraindications)
      ? contraindications.filter(c => c && Array.isArray(c.relatedProjects) && c.relatedProjects.includes(project.id)).map(c => c.id).filter(Boolean) as string[]
      : []

    return {
      projectId: project.id,
      projectName: project.name,
      relatedContraindicationIds: relatedContra,
    }
  } catch (e) {
    console.warn('buildProjectContext warning:', e)
    return undefined
  }
}

export function buildCategoryContext(category: string): ProjectContext | undefined {
  try {
    const contraIds = categoryContraindications[category]
    if (!Array.isArray(contraIds)) return undefined

    const validIds = Array.isArray(contraindications)
      ? contraIds.filter(id => contraindications.some(c => c?.id === id))
      : contraIds

    return {
      projectName: category,
      category,
      relatedContraindicationIds: validIds,
    }
  } catch (e) {
    console.warn('buildCategoryContext warning:', e)
    return undefined
  }
}

export function unifiedSearch(
  query: string,
  scriptsList: ScriptEntry[],
  adminConfigs: AdminConfig[]
): UnifiedSearchResult[] {
  if (!query || !query.trim()) return []

  try {
    const scriptResults = searchScripts(query, scriptsList)

    const tokens = expandQuery(query)
    const originalTokens = query.trim().split(/\s+/).filter(t => t)
    const allTokens = Array.from(new Set([...originalTokens, ...tokens])).filter(t => t)

    const searchableTypes: AdminConfig['type'][] = ['store-expression', 'promotion', 'complaint-template']
    const adminResults: UnifiedSearchResult[] = []

    if (Array.isArray(adminConfigs)) {
      for (const config of adminConfigs) {
        if (!config || !config.active || !searchableTypes.includes(config.type)) continue

        let score = 0
        const matchedKeywords: string[] = []
        const title = config.title || ''
        const content = config.content || ''

        for (const token of allTokens) {
          if (!token) continue
          const t = token.toLowerCase()
          if (title.toLowerCase().includes(t)) {
            score += 3
            if (!matchedKeywords.includes(token)) matchedKeywords.push(token)
          }
          if (content.toLowerCase().includes(t)) {
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
              title,
              content,
              scenes: (config as any).scenes || [],
            },
            matchedKeywords,
          })
        }
      }
    }

    const mappedScriptResults: UnifiedSearchResult[] = scriptResults.map(r => {
      const detectedProjectName = Array.isArray(projects)
        ? projects.find(p => p?.id === r.entry.projectRef)?.name
        : undefined
      let projectContext: ProjectContext | undefined
      if (detectedProjectName) {
        projectContext = buildProjectContext(detectedProjectName)
      }
      if (!projectContext && r.entry.category) {
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
  } catch (e) {
    console.error('unifiedSearch error:', e)
    return []
  }
}
