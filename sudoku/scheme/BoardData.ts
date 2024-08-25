const columnIdentifiers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type ColumnIdentifier = (typeof columnIdentifiers)[number];

const rowIdentifiers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type RowIdentifier = (typeof rowIdentifiers)[number];

const blockIdentifiers = [
  "tl",
  "tc",
  "tr",
  "cl",
  "cc",
  "cr",
  "bl",
  "bc",
  "br",
] as const;
type BlockIdentifier = (typeof blockIdentifiers)[number];

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type Digit = (typeof digits)[number];

export function isDigit(value: any): value is Digit {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value);
}

export interface CellData {
  value?: Digit;
  isInitial: boolean;
}

export interface CellPosition {
  rowId: number;
  columnId: number;
}

export interface RowPosition {
  rowId: number;
}

export interface RowData {
  cells: Array<CellData>;
}

export interface BoardData {
  rows: Array<RowData>;
}
