import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SectionConfig = {
  visible: boolean
  height: number  // 0 = auto, >0 = explicit px
}

const DEFAULT: SectionConfig = { visible: true, height: 0 }

type Store = {
  configs: Record<string, Record<string, SectionConfig>>
  toggle    (page: string, id: string): void
  setHeight (page: string, id: string, h: number): void
  showAll   (page: string): void
  getConfig (page: string, id: string): SectionConfig
}

export const useModuleSectionsStore = create<Store>()(
  persist(
    (set, get) => ({
      configs: {},

      getConfig: (page, id) => get().configs[page]?.[id] ?? DEFAULT,

      toggle: (page, id) =>
        set(s => {
          const cfg = s.configs[page]?.[id] ?? DEFAULT
          return {
            configs: {
              ...s.configs,
              [page]: { ...s.configs[page], [id]: { ...cfg, visible: !cfg.visible } },
            },
          }
        }),

      setHeight: (page, id, h) =>
        set(s => {
          const cfg = s.configs[page]?.[id] ?? DEFAULT
          return {
            configs: {
              ...s.configs,
              [page]: { ...s.configs[page], [id]: { ...cfg, height: h } },
            },
          }
        }),

      showAll: (page) =>
        set(s => ({
          configs: {
            ...s.configs,
            [page]: Object.fromEntries(
              Object.entries(s.configs[page] ?? {}).map(([k, v]) => [k, { ...v, visible: true }]),
            ),
          },
        })),
    }),
    { name: 'bloomfield-module-sections' },
  ),
)
