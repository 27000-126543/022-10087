import { useState } from 'react'
import { ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import projects from '@/data/projects'
import type { Project } from '@/data/projects'

const categoryLabels: Record<string, string> = {
  all: '全部',
  'anti-aging': '抗衰',
  injection: '注射',
  laser: '光电',
  skincare: '美肤',
  body: '身体',
}

const tabs = ['all', 'anti-aging', 'injection', 'laser', 'skincare'] as const

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-[#E8734A]">
          {categoryLabels[project.category]}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
        {project.description}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-xs text-[#E8734A] hover:underline"
      >
        {expanded ? '收起' : '展开详情'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <div
        className={cn(
          'overflow-hidden transition-[max-height] duration-300 ease-in-out',
          expanded ? 'max-h-[800px]' : 'max-h-0'
        )}
      >
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Tag size={12} className="text-[#E8734A]" />
              注意事项
            </div>
            <ul className="mt-1 space-y-0.5 pl-3 text-[11px] text-gray-500">
              {project.precautions.map((p, i) => (
                <li key={i} className="list-disc">{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700">标准话术</div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              {project.standardScript}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700">常见问答</div>
            <div className="mt-1 space-y-2">
              {project.faqs.map((faq, i) => (
                <div key={i} className="text-[11px]">
                  <span className="font-medium text-gray-700">Q: {faq.q}</span>
                  <p className="text-gray-500">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectGlossary() {
  const [activeTab, setActiveTab] = useState<string>('all')

  const filtered =
    activeTab === 'all'
      ? projects
      : projects.filter((p) => p.category === activeTab)

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex shrink-0 overflow-x-auto border-b border-gray-200 bg-white px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'relative shrink-0 px-4 py-2.5 text-sm whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'font-semibold text-[#E8734A]'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {categoryLabels[tab]}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#E8734A]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
