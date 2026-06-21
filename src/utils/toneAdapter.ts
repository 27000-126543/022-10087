import { ScriptEntry, ToneModifier } from '@/data/scripts'

export type { ToneModifier }

export interface AdaptedScript {
  empathy: string
  explanation: string
  guide: string
}

const PRIORITY_ORDER: ToneModifier[] = ['urgent', 'cautious', 'warm', 'professional', 'enthusiastic']

type SectionKey = 'empathy' | 'explanation' | 'guide'

export function adaptTone(entry: ScriptEntry, toneModifiers: ToneModifier[]): AdaptedScript {
  const sortedModifiers = [...toneModifiers].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a) - PRIORITY_ORDER.indexOf(b)
  )

  const sections: SectionKey[] = ['empathy', 'explanation', 'guide']
  const result: AdaptedScript = { empathy: entry.empathy, explanation: entry.explanation, guide: entry.guide }

  for (const section of sections) {
    for (const modifier of sortedModifiers) {
      const override = entry.toneOverrides?.[modifier]?.[section]
      if (override) {
        result[section] = override
        break
      }
    }
  }

  return result
}
