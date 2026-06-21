import { useState } from 'react'
import { Search, BookOpen, UserCircle, AlertTriangle, StickyNote, ClipboardList, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import SearchPanel from '@/components/SearchPanel'
import ProjectGlossary from '@/components/ProjectGlossary'
import CustomerProfile from '@/components/CustomerProfile'
import Contraindications from '@/components/Contraindications'
import ScriptNotes from '@/components/ScriptNotes'
import HandoverRecords from '@/components/HandoverRecords'
import AdminPanel from '@/components/AdminPanel'

const NAV_ITEMS = [
  { key: 'search', label: '快捷搜索', Icon: Search },
  { key: 'glossary', label: '项目词库', Icon: BookOpen },
  { key: 'profile', label: '顾客画像', Icon: UserCircle },
  { key: 'contraindications', label: '禁忌提醒', Icon: AlertTriangle },
  { key: 'notes', label: '话术便签', Icon: StickyNote },
  { key: 'handover', label: '交接记录', Icon: ClipboardList },
]

const PANEL_MAP: Record<string, React.ComponentType> = {
  search: SearchPanel,
  glossary: ProjectGlossary,
  profile: CustomerProfile,
  contraindications: Contraindications,
  notes: ScriptNotes,
  handover: HandoverRecords,
}

export default function Home() {
  const [activePanel, setActivePanel] = useState('search')
  const [showAdmin, setShowAdmin] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const ActiveComponent = PANEL_MAP[activePanel]

  if (showAdmin) {
    return (
      <div className="h-screen w-screen flex flex-col" style={{ background: '#FAF7F2' }}>
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
          <button
            onClick={() => setShowAdmin(false)}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回主页
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <AdminPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex" style={{ background: '#FAF7F2' }}>
      <nav
        className={cn(
          'flex flex-col shrink-0 border-r border-gray-200 bg-white transition-all duration-300',
          collapsed ? 'w-16' : 'w-48'
        )}
      >
        <div className={cn(
          'flex items-center gap-2 px-4 py-4 border-b border-gray-100',
          collapsed && 'justify-center px-0'
        )}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E8734A' }}>
            <span className="text-white text-sm font-bold">话</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold truncate" style={{ color: '#2D2016' }}>话术速查</div>
              <div className="text-[10px] text-[#64748B] truncate">面诊助手工具</div>
            </div>
          )}
        </div>

        <div className="flex-1 py-2 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActivePanel(key)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                activePanel === key
                  ? 'text-white shadow-sm'
                  : 'text-[#64748B] hover:bg-gray-50',
                collapsed && 'justify-center px-0'
              )}
              style={activePanel === key ? { backgroundColor: '#E8734A' } : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </div>

        <div className="px-2 py-2 border-t border-gray-100 space-y-1">
          <button
            onClick={() => setShowAdmin(true)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#64748B] hover:bg-gray-50 transition-colors',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? '管理后台' : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>管理后台</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#64748B] hover:bg-gray-50 transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>收起导航</span>}
          </button>
        </div>
      </nav>

      <main className="flex-1 min-w-0 overflow-hidden">
        <ActiveComponent />
      </main>
    </div>
  )
}
