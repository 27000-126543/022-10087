import { useState } from 'react'
import { Lock, LogOut, Plus, Save, Trash2, Edit3, ToggleLeft, ToggleRight, X, Shield } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { cn } from '@/lib/utils'
import type { AdminConfig } from '@/data/adminDefaults'

type ConfigType = AdminConfig['type']

const SCENE_OPTIONS = ['新客', '老客', '预算敏感', '术后关怀', '婚前急需', '高消费力']

const TABS: { key: ConfigType; label: string }[] = [
  { key: 'store-expression', label: '门店专属表达' },
  { key: 'banned-claim', label: '禁用夸大承诺' },
  { key: 'promotion', label: '活动套餐说明' },
  { key: 'complaint-template', label: '投诉回应模板' },
]

function LoginForm({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = onLogin(password)
    if (!ok) { setError(true); setPassword('') }
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: '#2D2016' }}>
          <Lock className="w-5 h-5 text-[#E8734A]" />
          <span>主管登录</span>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          placeholder="请输入密码"
          className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8734A]/30 focus:border-[#E8734A]"
          style={{ color: '#2D2016' }}
        />
        {error && <p className="text-xs text-red-500">密码错误</p>}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-[#E8734A] hover:bg-[#d4623a] transition-colors"
        >
          登录
        </button>
      </form>
    </div>
  )
}

function ConfigItem({
  config,
  onToggle,
  onEdit,
}: {
  config: AdminConfig
  onToggle: () => void
  onEdit: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate" style={{ color: '#2D2016' }}>{config.title}</h4>
          <p
            className="text-xs mt-1 leading-relaxed overflow-hidden"
            style={{
              color: '#64748B',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {config.content}
          </p>
          {config.scenes && config.scenes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {config.scenes.map((scene) => (
                <span
                  key={scene}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: 'rgba(232, 115, 74, 0.1)', color: '#E8734A' }}
                >
                  {scene}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggle} className="transition-colors">
            {config.active
              ? <ToggleRight className="w-6 h-6 text-[#4CAF82]" />
              : <ToggleLeft className="w-6 h-6 text-gray-300" />}
          </button>
          <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <Edit3 className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfigForm({
  initial,
  type,
  onSave,
  onDelete,
  onClose,
}: {
  initial: AdminConfig | null
  type: ConfigType
  onSave: (data: { title: string; content: string; active: boolean; scenes: string[] }) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [active, setActive] = useState(initial?.active ?? true)
  const [scenes, setScenes] = useState<string[]>(initial?.scenes ?? [])

  const showScenes = type === 'store-expression' || type === 'promotion'

  const toggleScene = (scene: string) => {
    setScenes((prev) =>
      prev.includes(scene) ? prev.filter((s) => s !== scene) : [...prev, scene]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: '#2D2016' }}>
            {initial ? '编辑配置' : '新增配置'}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8734A]/30 focus:border-[#E8734A]"
            style={{ color: '#2D2016' }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容"
            rows={5}
            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8734A]/30 focus:border-[#E8734A]"
            style={{ color: '#2D2016' }}
          />
          {showScenes && (
            <div className="space-y-2">
              <span className="text-sm" style={{ color: '#64748B' }}>适用场景</span>
              <div className="flex flex-wrap gap-2">
                {SCENE_OPTIONS.map((scene) => (
                  <button
                    key={scene}
                    type="button"
                    onClick={() => toggleScene(scene)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: scenes.includes(scene) ? '#E8734A' : 'transparent',
                      color: scenes.includes(scene) ? '#FFFFFF' : '#E8734A',
                      border: `1px solid ${scenes.includes(scene) ? '#E8734A' : '#E8734A'}`,
                    }}
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#64748B' }}>启用状态</span>
            <button onClick={() => setActive(!active)} className="transition-colors">
              {active
                ? <ToggleRight className="w-6 h-6 text-[#4CAF82]" />
                : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onSave({ title, content, active, scenes })}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#E8734A] hover:bg-[#d4623a] transition-colors"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const { isAuthenticated, login, logout, addConfig, updateConfig, deleteConfig, getConfigsByType } = useAdminStore()
  const [activeTab, setActiveTab] = useState<ConfigType>('store-expression')
  const [editing, setEditing] = useState<AdminConfig | null>(null)
  const [isNew, setIsNew] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full" style={{ background: '#FAF7F2' }}>
        <LoginForm onLogin={login} />
      </div>
    )
  }

  const items = getConfigsByType(activeTab)

  const handleSave = (data: { title: string; content: string; active: boolean; scenes: string[] }) => {
    if (isNew) {
      addConfig({ id: `admin-${activeTab}-${Date.now()}`, type: activeTab, ...data })
    } else if (editing) {
      updateConfig(editing.id, data)
    }
    setEditing(null)
    setIsNew(false)
  }

  const handleDelete = () => {
    if (editing) deleteConfig(editing.id)
    setEditing(null)
    setIsNew(false)
  }

  const handleAdd = () => {
    setIsNew(true)
    setEditing(null)
  }

  const handleEdit = (config: AdminConfig) => {
    setIsNew(false)
    setEditing(config)
  }

  const closeForm = () => {
    setEditing(null)
    setIsNew(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#FAF7F2' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#E8734A]" />
          <span className="text-base font-semibold" style={{ color: '#2D2016' }}>管理后台</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8734A] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出
        </button>
      </div>

      <div className="flex border-b border-gray-200 bg-white">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 py-2.5 text-xs font-medium transition-colors border-b-2',
              activeTab === tab.key
                ? 'text-[#E8734A] border-[#E8734A]'
                : 'text-[#64748B] border-transparent hover:text-[#2D2016]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((config) => (
          <ConfigItem
            key={config.id}
            config={config}
            onToggle={() => updateConfig(config.id, { active: !config.active })}
            onEdit={() => handleEdit(config)}
          />
        ))}

        <button
          onClick={handleAdd}
          className="w-full py-3 rounded-xl text-sm font-medium text-[#E8734A] border-2 border-dashed border-[#E8734A]/30 hover:border-[#E8734A]/60 hover:bg-[#E8734A]/5 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          新增
        </button>
      </div>

      {(editing || isNew) && (
        <ConfigForm
          initial={editing}
          type={activeTab}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
