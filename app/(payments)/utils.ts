import { organizations } from './data'

export const getOrgName = (id: string) =>
  organizations.find(o => o.id === id)?.name ?? id

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
