import { DataTable as DataTableBase } from './DataTable'
import {
  Toolbar,
  IconButton,
  ViewToggle,
  FilterButton,
  SortButton,
  SelectionInfo,
} from './Toolbar'
import { ProgressBar } from './ProgressBar'

type DataTableWithSubs = typeof DataTableBase & {
  Toolbar: typeof Toolbar
  IconButton: typeof IconButton
  ViewToggle: typeof ViewToggle
  FilterButton: typeof FilterButton
  SortButton: typeof SortButton
  SelectionInfo: typeof SelectionInfo
  ProgressBar: typeof ProgressBar
}

const DataTable = DataTableBase as DataTableWithSubs
DataTable.Toolbar = Toolbar
DataTable.IconButton = IconButton
DataTable.ViewToggle = ViewToggle
DataTable.FilterButton = FilterButton
DataTable.SortButton = SortButton
DataTable.SelectionInfo = SelectionInfo
DataTable.ProgressBar = ProgressBar

export { DataTable }
export default DataTable

// Re-export types
export type {
  DataTableProps,
  DataTableColumn,
  DataTableDisplay,
  DataTableDensity,
  ColumnAlign,
  SortDirection,
  SortState,
  CardRenderOptions,
} from './DataTable'

export type {
  IconButtonProps,
  ViewToggleProps,
  FilterButtonProps,
  SortButtonProps,
  SelectionInfoProps,
} from './Toolbar'

export type {
  ProgressBarProps,
  ProgressBarStatus,
} from './ProgressBar'
