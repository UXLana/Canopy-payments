// Core outlined icons + BaseIcon types
export * from './Icons'

// Pre-existing filled status icons (used by Banner, etc.)
export * from './IconInfoFilled'
export * from './IconSuccessFilled'
export * from './IconWarningFilled'
export * from './IconErrorFilled'

// Package-type icons
export * from './IconPackageTypes'

// Icon registry + themed icon component
export * from './registry'
export * from './ThemedIcon'

// Filled icon set — explicit exports to avoid name clash with legacy IconInfoFilled.
// The filled set's IconInfoFilled is still registered in the icon registry
// (as "Info" in the "filled" set) via register-filled.ts.
export {
  IconHomeFilled,
  IconMenuFilled,
  IconSearchFilled,
  IconArrowLeftFilled,
  IconArrowRightFilled,
  IconChevronDownFilled,
  IconChevronUpFilled,
  IconChevronRightFilled,
  IconPlusFilled,
  IconMinusFilled,
  IconXFilled,
  IconCheckFilled,
  IconEditFilled,
  IconTrashFilled,
  IconDownloadFilled,
  IconUploadFilled,
  IconAlertCircleFilled,
  IconCheckCircleFilled,
  IconXCircleFilled,
  IconFileFilled,
  IconFolderFilled,
  IconUserFilled,
  IconCalendarFilled,
  IconSettingsFilled,
  IconFilterFilled,
  IconSortFilled,
  IconGridFilled,
  IconListFilled,
  IconMoreHorizontalFilled,
} from './sets/filled/FilledIcons'
export { IconInfoFilled as IconInfoFilledThemed } from './sets/filled/FilledIcons'

// Side-effect imports: register icons into the registry at module load time
import './register-outlined'
import './register-filled'
