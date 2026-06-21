import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import contraindications from '@/data/contraindications'

export default function Contraindications() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const resetAll = () => {
    setChecked(new Set())
    setExpanded(new Set())
  }

  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes pulse-red {
          0%, 100% { border-left-color: #ef4444; }
          50% { border-left-color: #fca5a5; }
        }
      `}</style>

      <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        <div>
          <h2 className="text-base font-bold text-amber-800">禁忌提醒</h2>
          <p className="text-xs text-amber-600">以下事项必须在咨询中确认，避免遗漏</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {contraindications.map(item => {
          const isChecked = checked.has(item.id)
          const isExpanded = expanded.has(item.id)
          const isCritical = item.severity === 'critical'

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-lg border bg-white transition-opacity',
                isCritical && !isChecked && 'border-l-4 pulse-red-border',
                isChecked && 'opacity-50',
              )}
              style={
                isCritical && !isChecked
                  ? { animation: 'pulse-red 2s ease-in-out infinite', borderLeftWidth: '4px', borderLeftColor: '#ef4444' }
                  : undefined
              }
            >
              <div className="flex items-start gap-3 p-3">
                <button
                  onClick={() => toggleCheck(item.id)}
                  className="mt-0.5 shrink-0"
                >
                  {isChecked ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className={cn(
                      'h-5 w-5 rounded-full border-2',
                      isCritical ? 'border-red-400' : 'border-gray-300',
                    )} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isCritical && !isChecked && (
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    )}
                    <span className={cn(
                      'font-bold text-sm',
                      isChecked && 'line-through text-gray-400',
                      !isChecked && 'text-gray-900',
                    )}>
                      {item.name}
                    </span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-medium',
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700',
                    )}>
                      {isCritical ? '必须追问' : '建议确认'}
                    </span>
                  </div>
                  <p className={cn(
                    'mt-1 text-xs leading-relaxed',
                    isChecked ? 'text-gray-300' : 'text-gray-500',
                  )}>
                    {item.description}
                  </p>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="mt-1.5 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    必问话术
                  </button>

                  {isExpanded && (
                    <div className="mt-1.5 rounded bg-blue-50 px-3 py-2 text-xs text-blue-800 border border-blue-100">
                      <AlertCircle className="h-3 w-3 inline mr-1 align-text-bottom" />
                      {item.mustAsk}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
        <span className="text-xs text-gray-600">
          已确认 {checked.size} / 共 {contraindications.length} 项
        </span>
        <button
          onClick={resetAll}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          全部重置
        </button>
      </div>
    </div>
  )
}
