import { useState } from 'react'
import { StickyNote, Plus, Trash2, ChevronDown, ChevronUp, ArrowRightLeft, Save } from 'lucide-react'
import { useNoteStore } from '@/store/noteStore'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

const PROJECT_OPTIONS = [
  '热玛吉', '水光针', '肉毒素', '玻尿酸', '皮秒激光',
  '光子嫩肤', '超声刀', '线雕提升', '瘦脸针', '欧星',
]

const BUDGET_OPTIONS = ['未提及', '3000以内', '3000-8000', '8000-15000', '15000以上']

const TAG_COLORS: Record<string, string> = {
  frequency: '#E8734A',
  skin: '#8B5CF6',
  urgency: '#EF4444',
  spending: '#3B82F6',
  personality: '#10B981',
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-gray-200 text-gray-600' },
  'pending-handover': { label: '待交接', className: 'bg-orange-100 text-orange-600' },
  'handed-over': { label: '已交接', className: 'bg-green-100 text-green-600' },
}

export default function ScriptNotes() {
  const { notes, addNote, deleteNote } = useNoteStore()
  const { selectedTags, profileTags } = useProfileStore()
  const [customerQuote, setCustomerQuote] = useState('')
  const [interestedProjects, setInterestedProjects] = useState<string[]>([])
  const [budget, setBudget] = useState('未提及')
  const [painPoints, setPainPoints] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getTagById = (id: string) => profileTags.find((t) => t.id === id)

  const toggleProject = (name: string) => {
    setInterestedProjects((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    )
  }

  const resetForm = () => {
    setCustomerQuote('')
    setInterestedProjects([])
    setBudget('未提及')
    setPainPoints('')
  }

  const handleSave = (status: 'draft' | 'pending-handover') => {
    addNote({
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      customerQuote,
      interestedProjects,
      budget,
      painPoints,
      profileTagIds: selectedTags,
      status,
      createdBy: '当前咨询师',
      createdAt: new Date().toISOString(),
    })
    resetForm()
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const truncate = (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + '...' : text

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b font-semibold text-sm">
        <StickyNote size={16} />
        话术便签
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">顾客原话</label>
            <textarea
              value={customerQuote}
              onChange={(e) => setCustomerQuote(e.target.value)}
              placeholder="记录顾客的原话..."
              className="w-full text-xs border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">关注项目</label>
            <div className="flex flex-wrap gap-1.5">
              {PROJECT_OPTIONS.map((name) => (
                <button
                  key={name}
                  onClick={() => toggleProject(name)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-full border transition-colors',
                    interestedProjects.includes(name)
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  )}
                >
                  {interestedProjects.includes(name) && <Plus size={10} className="inline mr-0.5" />}
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">可接受价位</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full text-xs border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">反感点</label>
            <textarea
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              placeholder="记录顾客的反感点或顾虑..."
              className="w-full text-xs border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSave('draft')}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Save size={14} />
              保存便签
            </button>
            <button
              onClick={() => handleSave('pending-handover')}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              <ArrowRightLeft size={14} />
              保存并标记交接
            </button>
          </div>
        </div>

        {sortedNotes.length > 0 && (
          <div className="space-y-2">
            {sortedNotes.map((note) => {
              const expanded = expandedId === note.id
              const statusInfo = STATUS_MAP[note.status]
              return (
                <div
                  key={note.id}
                  className="border rounded-lg p-3 cursor-pointer hover:border-indigo-300 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : note.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(note.createdAt).toLocaleString('zh-CN')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusInfo.className)}>
                        {statusInfo.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {note.customerQuote && (
                    <p className="text-xs text-gray-700 mb-1">
                      {expanded ? note.customerQuote : truncate(note.customerQuote, 40)}
                    </p>
                  )}

                  {note.interestedProjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {note.interestedProjects.map((p) => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {note.profileTagIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {note.profileTagIds.map((tagId) => {
                        const tag = getTagById(tagId)
                        if (!tag) return null
                        const color = TAG_COLORS[tag.group]
                        return (
                          <span
                            key={tagId}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${color}15`, color }}
                          >
                            {tag.name}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {note.budget !== '未提及' && (
                    <p className="text-[10px] text-gray-500 mb-1">价位: {note.budget}</p>
                  )}

                  {note.painPoints && (
                    <p className="text-xs text-gray-500">
                      {expanded ? note.painPoints : truncate(note.painPoints, 40)}
                    </p>
                  )}

                  <div className="flex justify-center mt-1">
                    {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
