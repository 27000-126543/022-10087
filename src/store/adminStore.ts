import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AdminConfig, defaultAdminConfigs } from '@/data/adminDefaults'

interface AdminState {
  configs: AdminConfig[]
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  addConfig: (config: AdminConfig) => void
  updateConfig: (id: string, updates: Partial<AdminConfig>) => void
  deleteConfig: (id: string) => void
  getConfigsByType: (type: string) => AdminConfig[]
}

const DEFAULT_PASSWORD = '888888'

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      configs: defaultAdminConfigs,
      isAuthenticated: false,

      login: (password) => {
        if (password === DEFAULT_PASSWORD) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ isAuthenticated: false })
      },

      addConfig: (config) => {
        set((state) => ({ configs: [...state.configs, config] }))
      },

      updateConfig: (id, updates) => {
        set((state) => ({
          configs: state.configs.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }))
      },

      deleteConfig: (id) => {
        set((state) => ({
          configs: state.configs.filter((c) => c.id !== id),
        }))
      },

      getConfigsByType: (type) => {
        return get().configs.filter((c) => c.type === type)
      },
    }),
    {
      name: 'medical-beauty-admin',
    }
  )
)
