import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Heart, Info, Stethoscope, Copy, Check, UserCircle } from 'lucide-react'
import { useScriptStore } from '@/store/scriptStore'
import { useProfileStore } from '@/store/profileStore'
import { adaptTone, type AdaptedScript } from '@/utils/toneAdapter'
import { cn } from '@/lib/utils'

const SECTIONS: { key: keyof AdaptedScript; label: string; color: string; Icon: typeof Heart }[] = [
  { key: 'empathy', label: '共情', color: '#E8734A', Icon: Heart },
  { key: 'explanation', label: '解释', color: '#64748B', Icon: Info },
  { key: 'guide', label: '引导', color: '#4CAF82', Icon: Stethoscope },
]

export default function SearchPanel() {
  const { searchQuery, setSearchQuery, searchResults } = useScriptStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInput = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchQuery(value), 300)
  }, [setSearchQuery])

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  useEffect(() => {
    if (searchResults.length === 0) { setVisibleCount(0); return }
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= searchResults.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [searchResults])

  const handleCopy = (id: string, adapted: AdaptedScript) => {
    const text = SECTIONS.map(s => `【${s.label}】\n${adapted[s.key]}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const selectedTagIds = useProfileStore((s) => s.selectedTags)
  const profileTags = useProfileStore((s) => s.profileTags)
  const activeTags = useMemo(() => profileTags.filter((t) => selectedTagIds.includes(t.id)), [selectedTagIds, profileTags])
  const toneModifiers = useMemo(() => activeTags.map((t) => t.toneModifier), [activeTags])

  return (
    <div style={{ background: '#FAF7F2' }} className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="输入关键词搜索话术..."
            defaultValue={searchQuery}
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
        {searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-[#64748B]/40 mb-3" />
            <p className="text-sm text-[#64748B]">输入关键词，如"热玛吉疼不疼"</p>
          </div>
        )}

        {searchResults.map((entry, idx) => {
          const adapted = adaptTone(entry, toneModifiers)
          const isVisible = idx < visibleCount
          return (
            <div
              key={entry.id}
              className={cn(
                'bg-white rounded-xl shadow-sm p-4 transition-all duration-300',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#64748B] bg-gray-50 px-2 py-0.5 rounded">
                  {entry.category}
                </span>
                <button
                  onClick={() => handleCopy(entry.id, adapted)}
                  className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors"
                >
                  {copiedId === entry.id ? (
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
                      <p className="text-sm leading-relaxed" style={{ color: '#2D2016' }}>{adapted[key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
