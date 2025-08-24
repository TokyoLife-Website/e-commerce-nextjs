import { ReactElement } from "react";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  format?: (value: number) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any) => ReactElement | string | number;
}

export interface Data {
  id: string | number;
  [key: string]:
    | number
    | string
    | boolean
    | { name?: string; id?: string | number }
    | undefined;
}

export interface CustomTableProps {
  columns: readonly Column[];
  rows: Data[];
  rowsPerPage: number;
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  height?: number;
}
