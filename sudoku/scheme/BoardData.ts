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

export function getBlockIdentifier(position: CellPosition): BlockIdentifier {
  switch (position.rowId) {
    case 0:
    case 1:
    case 2:
      switch (position.columnId) {
        case 0:
        case 1:
        case 2:
          return "tl";
        case 3:
        case 4:
        case 5:
          return "tc";
        case 6:
        case 7:
        case 8:
          return "tr";
      }
      break;
    case 3:
    case 4:
    case 5:
      switch (position.columnId) {
        case 0:
        case 1:
        case 2:
          return "cl";
        case 3:
        case 4:
        case 5:
          return "cc";
        case 6:
        case 7:
        case 8:
          return "cr";
      }
      break;
    case 6:
    case 7:
    case 8:
      switch (position.columnId) {
        case 0:
        case 1:
        case 2:
          return "bl";
        case 3:
        case 4:
        case 5:
          return "bc";
        case 6:
        case 7:
        case 8:
          return "br";
      }
  }
  throw Error(`invalid Position ${JSON.stringify(position)}`);
}

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type Digit = (typeof digits)[number];

export function isDigit(value: any): value is Digit {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value);
}

export type CellHints = Map<Digit, boolean>;

export type CellType = "given" | "editable";

export type CellData = {
  value?: Digit;
  hints?: CellHints;
  type: CellType;
};

export type CellPosition = { rowId: number; columnId: number };

export type RowPosition = { rowId: number };

export type RowData = { cells: Array<CellData> };

export type BoardData = { rows: Array<RowData> };
