import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Heart, Info, Stethoscope, Copy, Check, UserCircle, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { useScriptStore, type UnifiedSearchResult } from '@/store/scriptStore'
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

const SAFETY_CATEGORIES = ['注射', '激光', '抗衰']

export default function SearchPanel() {
  const { unifiedSearchQuery, unifiedSearchResults, setUnifiedSearchQuery } = useScriptStore()
  const { configs: adminConfigs } = useAdminStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [expandedContraId, setExpandedContraId] = useState<string | null>(null)
  const [showBannedDialog, setShowBannedDialog] = useState(false)
  const [pendingCopy, setPendingCopy] = useState<{ id: string; text: string } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeBannedClaims = useMemo(() => adminConfigs.filter(c => c.type === 'banned-claim' && c.active), [adminConfigs])

  const handleInput = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setUnifiedSearchQuery(value), 300)
  }, [setUnifiedSearchQuery])

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  useEffect(() => {
    if (unifiedSearchResults.length === 0) { setVisibleCount(0); return }
    let i = 0
    const interval = setInterval(() => { i++; setVisibleCount(i); if (i >= unifiedSearchResults.length) clearInterval(interval) }, 60)
    return () => clearInterval(interval)
  }, [unifiedSearchResults])

  const executeCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }
  const handleCopy = (id: string, text: string) => {
    if (activeBannedClaims.length > 0) { setPendingCopy({ id, text }); setShowBannedDialog(true) }
    else executeCopy(id, text)
  }
  const confirmCopy = () => {
    if (pendingCopy) { executeCopy(pendingCopy.id, pendingCopy.text); setPendingCopy(null) }
    setShowBannedDialog(false)
  }
  const cancelCopy = () => { setPendingCopy(null); setShowBannedDialog(false) }

  const selectedTagIds = useProfileStore((s) => s.selectedTags)
  const profileTags = useProfileStore((s) => s.profileTags)
  const activeTags = useMemo(() => profileTags.filter((t) => selectedTagIds.includes(t.id)), [selectedTagIds, profileTags])
  const toneModifiers = useMemo(() => activeTags.map((t) => t.toneModifier), [activeTags])
  const getScriptCopyText = (adapted: AdaptedScript) => SECTIONS.map(s => `【${s.label}】\n${adapted[s.key]}`).join('\n\n')

  const renderScriptResult = (result: UnifiedSearchResult, idx: number) => {
    if (!result.entry) return null
    const adapted = adaptTone(result.entry, toneModifiers)
    const isVisible = idx < visibleCount
    const showSafety = SAFETY_CATEGORIES.includes(result.entry.category) && result.projectContext?.relatedContraindicationIds?.length
    const relatedContraindications = showSafety ? contraindications.filter(c => result.projectContext!.relatedContraindicationIds!.includes(c.id)) : []

    return (
      <div key={result.id} className={cn('bg-white rounded-xl shadow-sm p-4 transition-all duration-300', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#64748B] bg-gray-50 px-2 py-0.5 rounded">{result.entry.category}</span>
          <button onClick={() => handleCopy(result.id, getScriptCopyText(adapted))} className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors">
            {copiedId === result.id ? <><Check className="w-3.5 h-3.5" /><span>已复制</span></> : <><Copy className="w-3.5 h-3.5" /><span>复制</span></>}
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
                <p className="text-sm leading-relaxed" style={{ color: '#2D2016' }}>{adapted[key]}</p>
              </div>
            </div>
          ))}
        </div>
        {relatedContraindications.length > 0 && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-sm font-semibold text-red-700">安全提醒：请确认以下禁忌事项</span>
            </div>
            <div className="space-y-2">
              {relatedContraindications.map((contra) => (
                <div key={contra.id} className="text-sm">
                  <button onClick={() => setExpandedContraId(expandedContraId === contra.id ? null : contra.id)} className="w-full text-left">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium shrink-0', contra.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white')}>
                        {contra.severity === 'critical' ? '必须追问' : '建议确认'}
                      </span>
                      <span className="text-[#2D2016] flex-1">{contra.mustAsk}</span>
                      {expandedContraId === contra.id ? <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />}
                    </div>
                  </button>
                  {expandedContraId === contra.id && <p className="mt-1.5 ml-0 text-xs text-[#64748B] leading-relaxed">{contra.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderAdminResult = (result: UnifiedSearchResult, idx: number) => {
    if (!result.adminConfig) return null
    const typeInfo = ADMIN_TYPE_LABELS[result.type] || { label: result.type, color: '#64748B' }
    const isVisible = idx < visibleCount

    return (
      <div key={result.id} className={cn('bg-white rounded-xl shadow-sm p-4 transition-all duration-300', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded text-white" style={{ backgroundColor: typeInfo.color }}>{typeInfo.label}</span>
          <button onClick={() => handleCopy(result.id, result.adminConfig.content)} className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors">
            {copiedId === result.id ? <><Check className="w-3.5 h-3.5" /><span>已复制</span></> : <><Copy className="w-3.5 h-3.5" /><span>复制</span></>}
          </button>
        </div>
        <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#2D2016' }}>{result.adminConfig.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{result.adminConfig.content}</p>
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
            defaultValue={unifiedSearchQuery}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8734A]/30 focus:border-[#E8734A] transition-shadow"
            style={{ color: '#2D2016' }}
          />
        </div>
        {activeTags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <UserCircle className="w-4 h-4 text-[#E8734A] shrink-0" />
            <span className="text-xs text-[#64748B] shrink-0">当前画像：</span>
            {activeTags.map((tag) => (
              <span key={tag.id} className="inline-block text-xs px-2 py-0.5 rounded-full bg-[#E8734A]/10 text-[#E8734A]">{tag.name}</span>
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
        {unifiedSearchResults.map((result, idx) => (
          result.type === 'script' ? renderScriptResult(result, idx) : renderAdminResult(result, idx)
        ))}
      </div>

      {showBannedDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#E8734A]" />
              <h3 className="text-lg font-semibold" style={{ color: '#2D2016' }}>合规提醒</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>请确认您的表达符合规范，禁止使用绝对化承诺、夸大效果等违规表述。</p>
            <div className="mb-4 p-3 rounded-lg bg-gray-50">
              <ul className="space-y-1.5">
                {activeBannedClaims.slice(0, 3).map((claim) => (
                  <li key={claim.id} className="text-xs flex gap-2" style={{ color: '#64748B' }}>
                    <span className="text-[#E8734A]">•</span>
                    <span>{claim.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <button onClick={cancelCopy} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-[#64748B] hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={confirmCopy} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: '#E8734A' }}>确认并复制</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
