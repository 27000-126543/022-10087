import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  customerQuote: string
  interestedProjects: string[]
  budget: string
  painPoints: string
  profileTagIds: string[]
  status: 'draft' | 'pending-handover' | 'handed-over'
  createdBy: string
  createdAt: string
  handedOverAt?: string
}

interface NoteState {
  notes: Note[]
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  markAsHandedOver: (id: string) => void
  getNotesByStatus: (status: Note['status']) => Note[]
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (note) => {
        set((state) => ({ notes: [...state.notes, note] }))
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }))
      },

      markAsHandedOver: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, status: 'handed-over' as const, handedOverAt: new Date().toISOString() }
              : n
          ),
        }))
      },

      getNotesByStatus: (status) => {
        return get().notes.filter((n) => n.status === status)
      },
    }),
    {
      name: 'medical-beauty-notes',
    }
  )
)
