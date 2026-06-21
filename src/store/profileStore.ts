import { create } from 'zustand'
import { ProfileTag, defaultProfileTags } from '@/data/profileTags'

interface ProfileState {
  selectedTags: string[]
  profileTags: ProfileTag[]
  toggleTag: (tagId: string) => void
  clearTags: () => void
  getSelectedTags: () => ProfileTag[]
  getToneModifiers: () => string[]
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  selectedTags: [],
  profileTags: defaultProfileTags,

  toggleTag: (tagId) => {
    set((state) => {
      const exists = state.selectedTags.includes(tagId)
      return {
        selectedTags: exists
          ? state.selectedTags.filter((id) => id !== tagId)
          : [...state.selectedTags, tagId],
      }
    })
  },

  clearTags: () => {
    set({ selectedTags: [] })
  },

  getSelectedTags: () => {
    const { selectedTags, profileTags } = get()
    return profileTags.filter((tag) => selectedTags.includes(tag.id))
  },

  getToneModifiers: () => {
    const selected = get().getSelectedTags()
    return selected.map((tag) => tag.toneModifier)
  },
}))
