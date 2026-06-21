import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Heart, Info, Stethoscope, Copy, Check, UserCircle, AlertTriangle, Shield, ChevronDown, ChevronUp, History, Clock, Tag, AlertCircle } from 'lucide-react'
import { useScriptStore, type UnifiedSearchResult, type RecentSearch } from '@/store/scriptStore'
import { useProfileStore } from '@/store/profileStore'
import { useAdminStore } from '@/store/adminStore'
import { adaptTone, type AdaptedScript } from '@/utils/toneAdapter'
import { cn } from '@/lib/utils'
import contraindications from '@/data/contraindications'

const SECTIONS: { key: keyof AdaptedScript; label: string; color: string; Icon: typeof Heart }[] = [
  { key: 'empathy', label: '共情', color: '#E8734A', Icon: Heart },
  { key: 'explanation', label: '解释', color: '#64748B', Icon: Info },
  { key: 'guide', label: '引导', color: '#4CAF82', Icon: Stethoscope },
]

const ADMIN_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  'admin-store-expression': { label: '门店话术', color: '#E8734A' },
  'admin-promotion': { label: '活动套餐', color: '#4CAF82' },
  'admin-complaint-template': { label: '投诉模板', color: '#64748B' },
}

const SAFETY_CATEGORIES = ['注射', '激光', '抗衰', '光电', '美肤']

function getAdminConfigSignature(configs: any[]): string {
  return configs
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(c => `${c.id}:${c.active ? '1' : '0'}:${c.title}:${c.content}:${(c.scenes || []).join(',')}`)
    .join('||')
}

export default function SearchPanel() {
  const unifiedSearchQuery = useScriptStore((s) => s.unifiedSearchQuery)
  const unifiedSearchResults = useScriptStore((s) => s.unifiedSearchResults)
  const setUnifiedSearchQuery = useScriptStore((s) => s.setUnifiedSearchQuery)
  const triggerUnifiedSearch = useScriptStore((s) => s.unifiedSearch)
  const addRecentSearch = useScriptStore((s) => s.addRecentSearch)
  const recentSearches = useScriptStore((s) => s.recentSearches)
  const adminConfigs = useAdminStore((s) => s.configs)

  const [searchInput, setSearchInput] = useState(unifiedSearchQuery)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [expandedContraId, setExpandedContraId] = useState<string | null>(null)
  const [showBannedDialog, setShowBannedDialog] = useState(false)
  const [pendingCopy, setPendingCopy] = useState<{ id: string; text: string } | null>(null)
  const [inputFocused, setInputFocused] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSignatureRef = useRef<string>('')
  const lastQueryRef = useRef<string>('')

  const activeBannedClaims = useMemo(
    () => adminConfigs.filter(c => c.type === 'banned-claim' && c.active),
    [adminConfigs]
  )

  useEffect(() => {
    const sig = getAdminConfigSignature(adminConfigs)
    const currentQuery = lastQueryRef.current
    if (sig !== lastSignatureRef.current && currentQuery.trim()) {
      lastSignatureRef.current = sig
      triggerUnifiedSearch(currentQuery)
    }
    lastSignatureRef.current = sig
  }, [adminConfigs, triggerUnifiedSearch])

  useEffect(() => {
    setSearchInput(unifiedSearchQuery)
    lastQueryRef.current = unifiedSearchQuery
  }, [unifiedSearchQuery])

  const handleInput = useCallback((value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setUnifiedSearchQuery(value)
      if (value.trim()) {
        addRecentSearch(value)
      }
    }, 300)
  }, [setUnifiedSearchQuery, addRecentSearch])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    setVisibleCount(0)
    if (unifiedSearchResults.length === 0) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= unifiedSearchResults.length) {
        clearInterval(interval)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [unifiedSearchResults])

  const executeCopy = (id: string, text: string) => {
    if (!navigator?.clipboard) return
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1500)
  }

  const handleCopy = (id: string, text: string) => {
    if (activeBannedClaims.length > 0) {
      setPendingCopy({ id, text })
      setShowBannedDialog(true)
    } else {
      executeCopy(id, text)
    }
  }

  const confirmCopy = () => {
    if (pendingCopy) {
      executeCopy(pendingCopy.id, pendingCopy.text)
      setPendingCopy(null)
    }
    setShowBannedDialog(false)
  }

  const cancelCopy = () => {
    setPendingCopy(null)
    setShowBannedDialog(false)
  }

  const selectedTagIds = useProfileStore((s) => s.selectedTags)
  const profileTags = useProfileStore((s) => s.profileTags)
  const activeTags = useMemo(
    () => profileTags.filter((t) => selectedTagIds.includes(t.id)),
    [selectedTagIds, profileTags]
  )
  const toneModifiers = useMemo(
    () => activeTags.map((t) => t.toneModifier),
    [activeTags]
  )

  const getScriptCopyText = (adapted: AdaptedScript, relatedContraList?: typeof contraindications) => {
    const sectionsText = SECTIONS.map((s) => `【${s.label}】\n${adapted[s.key]}`).join('\n\n')
    if (relatedContraList && relatedContraList.length > 0) {
      const safetyText = relatedContraList
        .map((c) => `• ${c.mustAsk}`)
        .join('\n')
      return `${sectionsText}\n\n【安全核对】\n${safetyText}`
    }
    return sectionsText
  }

  const renderScriptResult = (result: UnifiedSearchResult, idx: number) => {
    if (!result.entry) return null

    let adapted: AdaptedScript
    try {
      adapted = adaptTone(result.entry, toneModifiers)
    } catch (e) {
      adapted = {
        empathy: result.entry.empathy,
        explanation: result.entry.explanation,
        guide: result.entry.guide,
      }
    }

    const isVisible = idx < visibleCount
    const category = result.entry.category || ''
    const hasSafety = SAFETY_CATEGORIES.includes(category)
      && Array.isArray(result.projectContext?.relatedContraindicationIds)
      && result.projectContext!.relatedContraindicationIds!.length > 0

    let relatedContraList = [] as typeof contraindications
    if (hasSafety && Array.isArray(contraindications)) {
      const ids = result.projectContext!.relatedContraindicationIds!
      relatedContraList = contraindications.filter((c) => c && ids.includes(c.id))
    }

    return (
      <div
        key={result.id}
        className={cn(
          'bg-white rounded-xl shadow-sm p-4 transition-all duration-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#64748B] bg-gray-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <button
            onClick={() => handleCopy(result.id, getScriptCopyText(adapted, relatedContraList))}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors"
          >
            {copiedId === result.id ? (
              <><Check className="w-3.5 h-3.5" /><span>已复制</span></>
            ) : (
              <><Copy className="w-3.5 h-3.5" /><span>复制</span></>
            )}
          </button>
        </div>
        <div className="space-y-2.5">
          {SECTIONS.map(({ key, label, color, Icon }) => (
            <div key={key} className="flex gap-2.5">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                  <span className="text-xs font-medium" style={{ color }}>{label}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#2D2016' }}>
                  {adapted[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
        {relatedContraList.length > 0 && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-sm font-semibold text-red-700">安全提醒：请确认以下禁忌事项</span>
            </div>
            {relatedContraList.filter(c => c.severity === 'critical').length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-base">🔴</span>
                  <span className="text-xs font-semibold text-red-700">必须追问</span>
                </div>
                <div className="space-y-2 pl-2">
                  {relatedContraList.filter(c => c.severity === 'critical').map((contra) => {
                    if (!contra) return null
                    const isExpanded = expandedContraId === contra.id
                    return (
                      <div key={contra.id} className="text-sm">
                        <button
                          onClick={() => setExpandedContraId(isExpanded ? null : contra.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#2D2016] flex-1">{contra.mustAsk}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                            )}
                          </div>
                        </button>
                        {isExpanded && contra.description && (
                          <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed">
                            {contra.description}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {relatedContraList.filter(c => c.severity === 'warning').length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-base">🟡</span>
                  <span className="text-xs font-semibold text-yellow-700">建议确认</span>
                </div>
                <div className="space-y-2 pl-2">
                  {relatedContraList.filter(c => c.severity === 'warning').map((contra) => {
                    if (!contra) return null
                    const isExpanded = expandedContraId === contra.id
                    return (
                      <div key={contra.id} className="text-sm">
                        <button
                          onClick={() => setExpandedContraId(isExpanded ? null : contra.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#2D2016] flex-1">{contra.mustAsk}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                            )}
                          </div>
                        </button>
                        {isExpanded && contra.description && (
                          <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed">
                            {contra.description}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderAdminResult = (result: UnifiedSearchResult, idx: number) => {
    if (!result.adminConfig) return null
    const typeInfo = ADMIN_TYPE_LABELS[result.type] || { label: result.type, color: '#64748B' }
    const isVisible = idx < visibleCount
    const scenes = result.adminConfig.scenes || []

    const copyText = `【标题】\n${result.adminConfig.title}\n\n【内容】\n${result.adminConfig.content}`

    return (
      <div
        key={result.id}
        className={cn(
          'bg-white rounded-xl shadow-sm p-4 transition-all duration-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: typeInfo.color }}
          >
            {typeInfo.label}
          </span>
          <button
            onClick={() => handleCopy(result.id, copyText)}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors"
          >
            {copiedId === result.id ? (
              <><Check className="w-3.5 h-3.5" /><span>已复制</span></>
            ) : (
              <><Copy className="w-3.5 h-3.5" /><span>复制</span></>
            )}
          </button>
        </div>
        <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#2D2016' }}>
          {result.adminConfig.title}
        </h3>
        {scenes.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <Tag className="w-3 h-3 text-[#64748B] shrink-0" />
            {scenes.map((scene, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#64748B]"
              >
                {scene}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
          {result.adminConfig.content}
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF7F2' }} className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="输入关键词搜索话术..."
            value={searchInput}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8734A]/30 focus:border-[#E8734A] transition-shadow"
            style={{ color: '#2D2016' }}
          />
        </div>
        {recentSearches.length > 0 && (inputFocused || unifiedSearchResults.length === 0) && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <History className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-xs font-medium text-[#64748B]">最近常搜</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item.query}
                  onClick={() => {
                    handleInput(item.query)
                    setSearchInput(item.query)
                  }}
                  className="group inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-[#E8734A]/10 transition-colors"
                  style={{ color: '#2D2016' }}
                >
                  <span>{item.query}</span>
                  <span
                    className="inline-flex items-center justify-center text-white rounded-full"
                    style={{
                      width: '16px',
                      height: '16px',
                      fontSize: '10px',
                      backgroundColor: '#E8734A',
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <UserCircle className="w-4 h-4 text-[#E8734A] shrink-0" />
            <span className="text-xs text-[#64748B] shrink-0">当前画像：</span>
            {activeTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block text-xs px-2 py-0.5 rounded-full bg-[#E8734A]/10 text-[#E8734A]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {unifiedSearchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-[#64748B]/40 mb-3" />
            <p className="text-sm text-[#64748B]">输入关键词，如"热玛吉疼不疼"</p>
          </div>
        )}
        {unifiedSearchResults.map((result, idx) =>
          result.type === 'script'
            ? renderScriptResult(result, idx)
            : renderAdminResult(result, idx)
        )}
      </div>

      {showBannedDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={cancelCopy}
        >
          <div
            className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#E8734A]" />
              <h3 className="text-lg font-semibold" style={{ color: '#2D2016' }}>合规提醒</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>
              请确认您的表达符合规范，禁止使用绝对化承诺、夸大效果等违规表述。
            </p>
            <div className="mb-4 p-3 rounded-lg bg-gray-50">
              <ul className="space-y-1.5">
                {activeBannedClaims.slice(0, 3).map((claim) => (
                  <li
                    key={claim.id}
                    className="text-xs flex gap-2"
                    style={{ color: '#64748B' }}
                  >
                    <span className="text-[#E8734A]">•</span>
                    <span>{claim.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelCopy}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-[#64748B] hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmCopy}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#E8734A' }}
              >
                确认并复制
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
