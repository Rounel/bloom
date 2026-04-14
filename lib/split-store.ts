import { create } from 'zustand'

export type GridPane = {
  id: string
  href: string
  label: string
}

type SplitStore = {
  isActive: boolean
  cols: number        // 1–3
  rows: number        // 1–3
  colSizes: number[]  // length = cols, sums to 100
  rowSizes: number[]  // length = rows, sums to 100
  cells: Record<string, GridPane>  // key = `${row}-${col}`
  isDraggingModule: boolean

  setIsDraggingModule(v: boolean): void

  /** First activation: create grid from normal mode */
  activate(
    currentHref: string,
    currentLabel: string,
    newHref: string,
    newLabel: string,
    targetRow: number,
    targetCol: number,
  ): void

  closeAll(): void
  setCols(n: number): void
  setRows(n: number): void
  setCell(row: number, col: number, href: string, label: string): void
  clearCell(row: number, col: number): void
  resizeCols(i: number, j: number, si: number, sj: number): void
  resizeRows(i: number, j: number, si: number, sj: number): void
}

let _seq = 0
const uid = () => `g-${++_seq}-${Date.now()}`

function even(n: number): number[] {
  return Array.from({ length: n }, () => 100 / n)
}

export const useSplitStore = create<SplitStore>((set, get) => ({
  isActive: false,
  cols: 2,
  rows: 2,
  colSizes: [50, 50],
  rowSizes: [50, 50],
  cells: {},
  isDraggingModule: false,

  setIsDraggingModule: v => set({ isDraggingModule: v }),

  activate: (currentHref, currentLabel, newHref, newLabel, targetRow, targetCol) => {
    const cols = targetCol + 1
    const rows = targetRow + 1
    const cells: Record<string, GridPane> = {
      '0-0': { id: uid(), href: currentHref, label: currentLabel },
      [`${targetRow}-${targetCol}`]: { id: uid(), href: newHref, label: newLabel },
    }
    set({
      isActive: true,
      cols, rows,
      colSizes: even(cols),
      rowSizes: even(rows),
      cells,
    })
  },

  closeAll: () => set({
    isActive: false,
    cols: 2, rows: 2,
    colSizes: [50, 50], rowSizes: [50, 50],
    cells: {},
  }),

  setCols: n => {
    if (n < 1 || n > 3) return
    set(s => {
      const cells = { ...s.cells }
      for (const key of Object.keys(cells)) {
        if (parseInt(key.split('-')[1]) >= n) delete cells[key]
      }
      return { cols: n, colSizes: even(n), cells }
    })
  },

  setRows: n => {
    if (n < 1 || n > 3) return
    set(s => {
      const cells = { ...s.cells }
      for (const key of Object.keys(cells)) {
        if (parseInt(key.split('-')[0]) >= n) delete cells[key]
      }
      return { rows: n, rowSizes: even(n), cells }
    })
  },

  setCell: (row, col, href, label) =>
    set(s => ({
      cells: { ...s.cells, [`${row}-${col}`]: { id: uid(), href, label } },
    })),

  clearCell: (row, col) =>
    set(s => {
      const cells = { ...s.cells }
      delete cells[`${row}-${col}`]
      return { cells }
    }),

  resizeCols: (i, j, si, sj) =>
    set(s => {
      const colSizes = [...s.colSizes]
      colSizes[i] = si
      colSizes[j] = sj
      return { colSizes }
    }),

  resizeRows: (i, j, si, sj) =>
    set(s => {
      const rowSizes = [...s.rowSizes]
      rowSizes[i] = si
      rowSizes[j] = sj
      return { rowSizes }
    }),
}))
