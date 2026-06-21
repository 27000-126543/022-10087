import { useState } from 'react'
import { ClipboardList, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { useNoteStore } from '@/store/noteStore'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | 'pending-handover' | 'handed-over'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending-handover', label: '待交接' },
  { key: 'handed-over', label: '已交接' },
]

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  'pending-handover': { label: '待交接', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  'handed-over': { label: '已交接', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${mi}`
}

function formatHHmm(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function HandoverRecords() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const { notes, updateNote, markAsHandedOver, getNotesByStatus } = useNoteStore()

  const filtered = activeTab === 'all'
    ? [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : getNotesByStatus(activeTab).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <ClipboardList className="w-5 h-5 text-[#E8734A]" />
        <h2 className="text-base font-semibold" style={{ color: '#2D2016' }}>交接记录</h2>
      </div>

      <div className="flex shrink-0 border-b border-gray-200 bg-white px-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative shrink-0 px-4 py-2.5 text-sm whitespace-nowrap transition-colors',
              activeTab === tab.key
                ? 'font-semibold text-[#E8734A]'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#E8734A]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ClipboardList className="w-10 h-10 mb-2" />
            <span className="text-sm">暂无记录</span>
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
            <div className="flex flex-col gap-4">
              {filtered.map((note) => {
                const meta = STATUS_META[note.status]
                return (
                  <div key={note.id} className="relative">
                    <div
                      className={cn(
                        'absolute -left-6 top-3 w-3.5 h-3.5 rounded-full border-2 border-white',
                        meta.dot
                      )}
                    />
                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B]">
                          <Clock className="inline w-3 h-3 mr-1" />
                          {formatTime(note.createdAt)}
                        </span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', meta.color)}>
                          {meta.label}
                        </span>
                      </div>

                      <p className="text-sm mb-2" style={{ color: '#2D2016' }}>{note.customerQuote}</p>

                      {note.interestedProjects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.interestedProjects.map((p) => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-[#E8734A]/10 text-[#E8734A]">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-[#64748B] mb-1">
                        <span>预算: {note.budget}</span>
                      </div>

                      {note.painPoints && (
                        <p className="text-xs text-[#64748B] mb-2">{note.painPoints}</p>
                      )}

                      <div className="flex items-center justify-between text-xs text-[#64748B]">
                        <span>创建: {note.createdBy}</span>
                        {note.handedOverAt && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            交接时间: {formatHHmm(note.handedOverAt)}
                          </span>
                        )}
                      </div>

                      {note.status === 'pending-handover' && (
                        <button
                          onClick={() => markAsHandedOver(note.id)}
                          className="mt-3 flex items-center gap-1 text-xs font-medium text-[#E8734A] hover:underline"
                        >
                          确认交接 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {note.status === 'draft' && (
                        <button
                          onClick={() => updateNote(note.id, { status: 'pending-handover' })}
                          className="mt-3 flex items-center gap-1 text-xs font-medium text-[#64748B] hover:underline"
                        >
                          标记待交接 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
