import { useState } from 'react'
import { X, Check, Tag } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useScriptStore } from '@/store/scriptStore'
import { adaptTone } from '@/utils/toneAdapter'
import { cn } from '@/lib/utils'

const GROUP_META: Record<string, { label: string; color: string }> = {
  frequency: { label: '频率', color: '#E8734A' },
  skin: { label: '肤质', color: '#8B5CF6' },
  urgency: { label: '紧迫度', color: '#EF4444' },
  spending: { label: '消费力', color: '#3B82F6' },
  personality: { label: '性格', color: '#10B981' },
}

const GROUP_ORDER = ['frequency', 'skin', 'urgency', 'spending', 'personality']

export default function CustomerProfile() {
  const { selectedTags, profileTags, toggleTag, clearTags } = useProfileStore()
  const scripts = useScriptStore((s) => s.scripts)
  const [bouncingTag, setBouncingTag] = useState<string | null>(null)

  const sample = scripts[0]
  const toneModifiers = profileTags.filter((t) => selectedTags.includes(t.id)).map((t) => t.toneModifier)
  const adapted = sample ? adaptTone(sample, toneModifiers) : null

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    ...GROUP_META[group],
    tags: profileTags.filter((t) => t.group === group),
  }))

  const handleToggle = (id: string) => {
    setBouncingTag(id)
    toggleTag(id)
    setTimeout(() => setBouncingTag(null), 200)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Tag size={16} />
          客户画像
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={12} />
            清空选择
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {grouped.map(({ group, label, color, tags }) => (
          <div key={group}>
            <div className="text-xs font-medium text-gray-500 mb-2">{label}</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTags.includes(tag.id)
                const bouncing = bouncingTag === tag.id
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleToggle(tag.id)}
                    style={{
                      borderColor: active ? color : '#e5e7eb',
                      backgroundColor: active ? color : 'transparent',
                      color: active ? '#fff' : '#374151',
                      transform: bouncing ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform 0.15s ease, background-color 0.2s, border-color 0.2s, color 0.2s',
                    }}
                    className="px-3 py-1 text-xs rounded-full border-2 flex items-center gap-1"
                  >
                    {active && <Check size={10} />}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {sample && adapted && (
        <div className="border-t px-4 py-3">
          <div className="text-xs font-medium text-gray-500 mb-2">语气预览</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-400 mb-1">原始话术</div>
              <div className="text-gray-700 leading-relaxed">{sample.empathy}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-400 mb-1">适配话术</div>
              <div className="leading-relaxed" style={{ color: selectedTags.length > 0 ? '#6366f1' : '#9ca3af' }}>
                {adapted.empathy}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
