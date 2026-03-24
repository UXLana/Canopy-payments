export interface Organization {
  id: string
  name: string
  logoInitials: string
  type: 'cultivator' | 'manufacturer' | 'distributor' | 'retailer' | 'microbusiness'
  licenseNumber: string
  market: string
}

export interface Facility {
  id: string
  name: string
  orgId: string
  type: string
  market: string
  address: string
}

export interface InvoiceLineItem {
  id: string
  productName: string
  sku: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  packageTag: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceType: 'standard' | 'credit-memo' | 'cod'
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'voided'
  senderOrgId: string
  receiverOrgId: string
  senderFacilityId: string
  receiverFacilityId: string
  market: string
  items: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  amountPaid: number
  amountDue: number
  createdAt: string
  deliveryDate: string
  dueDate: string
  paidAt: string | null
  paymentTerms: 'net-15' | 'net-30' | 'net-45' | 'net-60' | 'due-on-receipt'
  notes: string
  manifestNumber: string
  noticeOfDefaultSent: boolean
  dateNoticeSent: string | null
}

export interface Transaction {
  id: string
  invoiceId: string
  invoiceNumber: string
  type: 'payment' | 'refund' | 'adjustment'
  amount: number
  status: 'completed' | 'pending' | 'failed' | 'reversed'
  method: 'ach' | 'wire' | 'check' | 'cash'
  timestamp: string
  reference: string
  senderOrgId: string
  receiverOrgId: string
}

export interface PaymentMethod {
  id: string
  type: 'ach' | 'wire' | 'check'
  label: string
  bankName: string
  last4: string
  isDefault: boolean
}

export const organizations: Organization[] = [
  { id: 'org-001', name: 'Pacific Coast Holdings LLC', logoInitials: 'PC', type: 'cultivator', licenseNumber: 'C12-0000001-LIC', market: 'CA' },
  { id: 'org-002', name: 'Green Leaf Cultivation LLC', logoInitials: 'GL', type: 'cultivator', licenseNumber: 'M-12345', market: 'OR' },
  { id: 'org-003', name: 'Mountain View Dispensary', logoInitials: 'MV', type: 'retailer', licenseNumber: 'D-11223', market: 'CO' },
  { id: 'org-004', name: 'Sierra Distribution Co', logoInitials: 'SD', type: 'distributor', licenseNumber: 'P-67890', market: 'CA' },
  { id: 'org-005', name: 'Emerald Valley Farms', logoInitials: 'EV', type: 'cultivator', licenseNumber: 'C-44556', market: 'WA' },
]

export const facilities: Facility[] = [
  { id: 'fac-001', name: 'Pacific Coast Cultivation', orgId: 'org-001', type: 'cultivation', market: 'CA', address: '1240 Greenway Blvd, Salinas, CA 93901' },
  { id: 'fac-002', name: 'Pacific Coast Manufacturing', orgId: 'org-001', type: 'manufacturing', market: 'CA', address: '1242 Greenway Blvd, Salinas, CA 93901' },
  { id: 'fac-003', name: 'Green Leaf Greenhouse', orgId: 'org-002', type: 'cultivation', market: 'OR', address: '780 River Rd, Grants Pass, OR 97526' },
  { id: 'fac-004', name: 'Mountain View Retail', orgId: 'org-003', type: 'retail', market: 'CO', address: '455 Pearl St, Boulder, CO 80302' },
  { id: 'fac-005', name: 'Sierra Warehouse', orgId: 'org-004', type: 'distribution', market: 'CA', address: '9100 Distribution Way, Oakland, CA 94621' },
  { id: 'fac-006', name: 'Emerald Valley Farm', orgId: 'org-005', type: 'cultivation', market: 'WA', address: '3200 Cascade Hwy, Olympia, WA 98501' },
]

export const invoices: Invoice[] = [
  // --- PAID (3) ---
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    invoiceType: 'standard',
    status: 'paid',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-001',
    receiverFacilityId: 'fac-004',
    market: 'CO',
    items: [
      { id: 'li-001a', productName: 'Blue Dream Premium Flower', sku: 'PCE-FL-BD-001', category: 'Flower', quantity: 2000, unitPrice: 5.50, total: 11000.00, packageTag: '1A4060300000022000012345' },
      { id: 'li-001b', productName: 'OG Kush Live Resin', sku: 'PCE-CR-OGK-002', category: 'Concentrate', quantity: 500, unitPrice: 22.00, total: 11000.00, packageTag: '1A4060300000022000012346' },
      { id: 'li-001c', productName: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PCE-PR-SD-003', category: 'Pre-Roll', quantity: 800, unitPrice: 3.25, total: 2600.00, packageTag: '1A4060300000022000012347' },
    ],
    subtotal: 24600.00,
    taxRate: 0.0725,
    taxAmount: 1783.50,
    discount: 0,
    total: 26383.50,
    amountPaid: 26383.50,
    amountDue: 0,
    createdAt: '2026-01-28T09:00:00Z',
    deliveryDate: '2026-01-30T14:00:00Z',
    dueDate: '2026-02-27T09:00:00Z',
    paidAt: '2026-02-24T14:32:00Z',
    paymentTerms: 'net-30',
    notes: 'Q1 restock order for Boulder location. Deliver to rear loading dock.',
    manifestNumber: '0000001234',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    invoiceType: 'standard',
    status: 'paid',
    senderOrgId: 'org-002',
    receiverOrgId: 'org-004',
    senderFacilityId: 'fac-003',
    receiverFacilityId: 'fac-005',
    market: 'CA',
    items: [
      { id: 'li-002a', productName: 'Granddaddy Purple Flower', sku: 'GLC-FL-GDP-001', category: 'Flower', quantity: 5000, unitPrice: 4.25, total: 21250.00, packageTag: '1A4060300000022000013501' },
      { id: 'li-002b', productName: 'GSC Greenhouse Flower', sku: 'GLC-FL-GSC-002', category: 'Flower', quantity: 3000, unitPrice: 4.00, total: 12000.00, packageTag: '1A4060300000022000013502' },
    ],
    subtotal: 33250.00,
    taxRate: 0.0875,
    taxAmount: 2909.38,
    discount: 500,
    total: 36159.38,
    amountPaid: 36159.38,
    amountDue: 0,
    createdAt: '2026-02-03T11:15:00Z',
    deliveryDate: '2026-02-05T10:00:00Z',
    dueDate: '2026-03-05T11:15:00Z',
    paidAt: '2026-03-02T10:08:00Z',
    paymentTerms: 'net-30',
    notes: 'Bulk flower transfer for California distribution. COA attached.',
    manifestNumber: '0000001267',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-0003',
    invoiceType: 'standard',
    status: 'paid',
    senderOrgId: 'org-005',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-006',
    receiverFacilityId: 'fac-004',
    market: 'WA',
    items: [
      { id: 'li-003a', productName: 'Sour Diesel Outdoor Flower', sku: 'EVF-FL-SD-001', category: 'Flower', quantity: 1000, unitPrice: 4.00, total: 4000.00, packageTag: '1A4060300000022000014201' },
      { id: 'li-003b', productName: 'Blue Dream Pre-Roll Singles', sku: 'EVF-PR-BD-001', category: 'Pre-Roll', quantity: 500, unitPrice: 2.50, total: 1250.00, packageTag: '1A4060300000022000014202' },
    ],
    subtotal: 5250.00,
    taxRate: 0.065,
    taxAmount: 341.25,
    discount: 0,
    total: 5591.25,
    amountPaid: 5591.25,
    amountDue: 0,
    createdAt: '2026-02-10T08:30:00Z',
    deliveryDate: '2026-02-12T09:30:00Z',
    dueDate: '2026-02-25T08:30:00Z',
    paidAt: '2026-02-20T16:45:00Z',
    paymentTerms: 'net-15',
    notes: 'Small batch outdoor flower order.',
    manifestNumber: '0000001289',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },

  // --- PARTIAL (2) ---
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-0004',
    invoiceType: 'standard',
    status: 'partial',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-004',
    senderFacilityId: 'fac-002',
    receiverFacilityId: 'fac-005',
    market: 'CA',
    items: [
      { id: 'li-004a', productName: 'OG Kush Live Resin', sku: 'PCE-CR-OGK-002', category: 'Concentrate', quantity: 1000, unitPrice: 22.00, total: 22000.00, packageTag: '1A4060300000022000015001' },
      { id: 'li-004b', productName: 'GSC Distillate Cartridge', sku: 'PCE-CR-GSC-005', category: 'Concentrate', quantity: 2000, unitPrice: 15.00, total: 30000.00, packageTag: '1A4060300000022000015002' },
      { id: 'li-004c', productName: 'Mango Bliss Gummies', sku: 'PCE-ED-MBG-004', category: 'Edible', quantity: 1500, unitPrice: 4.50, total: 6750.00, packageTag: '1A4060300000022000015003' },
    ],
    subtotal: 58750.00,
    taxRate: 0.0875,
    taxAmount: 5140.63,
    discount: 1200,
    total: 63890.63,
    amountPaid: 30000.00,
    amountDue: 33890.63,
    createdAt: '2026-02-14T10:00:00Z',
    deliveryDate: '2026-02-16T11:00:00Z',
    dueDate: '2026-03-31T10:00:00Z',
    paidAt: null,
    paymentTerms: 'net-45',
    notes: 'Large concentrate and edible order for CA distribution. First partial payment received.',
    manifestNumber: '0000001301',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2026-0005',
    invoiceType: 'standard',
    status: 'partial',
    senderOrgId: 'org-002',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-003',
    receiverFacilityId: 'fac-004',
    market: 'OR',
    items: [
      { id: 'li-005a', productName: 'Granddaddy Purple Flower', sku: 'GLC-FL-GDP-001', category: 'Flower', quantity: 1500, unitPrice: 5.00, total: 7500.00, packageTag: '1A4060300000022000015101' },
      { id: 'li-005b', productName: 'Blue Dream Greenhouse Flower', sku: 'GLC-FL-BD-002', category: 'Flower', quantity: 1500, unitPrice: 4.75, total: 7125.00, packageTag: '1A4060300000022000015102' },
      { id: 'li-005c', productName: 'Sour Diesel Infused Pre-Roll', sku: 'GLC-PR-SDI-001', category: 'Pre-Roll', quantity: 600, unitPrice: 4.50, total: 2700.00, packageTag: '1A4060300000022000015103' },
    ],
    subtotal: 17325.00,
    taxRate: 0.0,
    taxAmount: 0,
    discount: 0,
    total: 17325.00,
    amountPaid: 10000.00,
    amountDue: 7325.00,
    createdAt: '2026-02-18T14:20:00Z',
    deliveryDate: '2026-02-19T13:00:00Z',
    dueDate: '2026-03-20T14:20:00Z',
    paidAt: null,
    paymentTerms: 'net-30',
    notes: 'Oregon has no cannabis excise tax. Partial payment of $10,000 received 3/1.',
    manifestNumber: '0000001318',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },

  // --- SENT (3) ---
  {
    id: 'inv-006',
    invoiceNumber: 'INV-2026-0006',
    invoiceType: 'standard',
    status: 'sent',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-001',
    receiverFacilityId: 'fac-004',
    market: 'CO',
    items: [
      { id: 'li-006a', productName: 'Blue Dream Premium Flower', sku: 'PCE-FL-BD-001', category: 'Flower', quantity: 3000, unitPrice: 5.50, total: 16500.00, packageTag: '1A4060300000022000016001' },
      { id: 'li-006b', productName: 'Granddaddy Purple Flower', sku: 'PCE-FL-GDP-009', category: 'Flower', quantity: 2000, unitPrice: 5.25, total: 10500.00, packageTag: '1A4060300000022000016002' },
      { id: 'li-006c', productName: 'Rest & Recover Tincture', sku: 'PCE-TN-RR-006', category: 'Tincture', quantity: 200, unitPrice: 12.00, total: 2400.00, packageTag: '1A4060300000022000016003' },
      { id: 'li-006d', productName: 'Mango Bliss Gummies', sku: 'PCE-ED-MBG-004', category: 'Edible', quantity: 400, unitPrice: 4.50, total: 1800.00, packageTag: '1A4060300000022000016004' },
    ],
    subtotal: 31200.00,
    taxRate: 0.0725,
    taxAmount: 2262.00,
    discount: 0,
    total: 33462.00,
    amountPaid: 0,
    amountDue: 33462.00,
    createdAt: '2026-03-05T09:00:00Z',
    deliveryDate: '2026-03-07T15:00:00Z',
    dueDate: '2026-04-04T09:00:00Z',
    paidAt: null,
    paymentTerms: 'net-30',
    notes: 'Spring restock — flower, tincture, and edibles for Boulder retail.',
    manifestNumber: '0000001342',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
  {
    id: 'inv-007',
    invoiceNumber: 'INV-2026-0007',
    invoiceType: 'cod',
    status: 'sent',
    senderOrgId: 'org-005',
    receiverOrgId: 'org-004',
    senderFacilityId: 'fac-006',
    receiverFacilityId: 'fac-005',
    market: 'WA',
    items: [
      { id: 'li-007a', productName: 'Blue Dream Outdoor Flower', sku: 'EVF-FL-BD-002', category: 'Flower', quantity: 4000, unitPrice: 3.75, total: 15000.00, packageTag: '1A4060300000022000016501' },
      { id: 'li-007b', productName: 'OG Kush Outdoor Flower', sku: 'EVF-FL-OGK-001', category: 'Flower', quantity: 2500, unitPrice: 4.00, total: 10000.00, packageTag: '1A4060300000022000016502' },
    ],
    subtotal: 25000.00,
    taxRate: 0.065,
    taxAmount: 1625.00,
    discount: 0,
    total: 26625.00,
    amountPaid: 0,
    amountDue: 26625.00,
    createdAt: '2026-03-08T13:45:00Z',
    deliveryDate: '2026-03-10T08:00:00Z',
    dueDate: '2026-03-23T13:45:00Z',
    paidAt: null,
    paymentTerms: 'net-15',
    notes: 'Bulk outdoor flower for WA distribution pipeline.',
    manifestNumber: '0000001355',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
  {
    id: 'inv-008',
    invoiceNumber: 'INV-2026-0008',
    invoiceType: 'standard',
    status: 'sent',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-004',
    senderFacilityId: 'fac-002',
    receiverFacilityId: 'fac-005',
    market: 'CA',
    items: [
      { id: 'li-008a', productName: 'GSC Distillate Cartridge', sku: 'PCE-CR-GSC-005', category: 'Concentrate', quantity: 3000, unitPrice: 15.00, total: 45000.00, packageTag: '1A4060300000022000017001' },
    ],
    subtotal: 45000.00,
    taxRate: 0.0875,
    taxAmount: 3937.50,
    discount: 2000,
    total: 48937.50,
    amountPaid: 0,
    amountDue: 48937.50,
    createdAt: '2026-03-12T10:30:00Z',
    deliveryDate: '2026-03-14T12:00:00Z',
    dueDate: '2026-04-26T10:30:00Z',
    paidAt: null,
    paymentTerms: 'net-45',
    notes: 'Large cartridge order for statewide CA distribution.',
    manifestNumber: '0000001368',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },

  // --- OVERDUE (2) ---
  {
    id: 'inv-009',
    invoiceNumber: 'INV-2026-0009',
    invoiceType: 'standard',
    status: 'overdue',
    senderOrgId: 'org-002',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-003',
    receiverFacilityId: 'fac-004',
    market: 'OR',
    items: [
      { id: 'li-009a', productName: 'Sour Diesel Greenhouse Flower', sku: 'GLC-FL-SD-003', category: 'Flower', quantity: 2000, unitPrice: 4.50, total: 9000.00, packageTag: '1A4060300000022000017501' },
      { id: 'li-009b', productName: 'GSC Pre-Roll 3-Pack', sku: 'GLC-PR-GSC-002', category: 'Pre-Roll', quantity: 1000, unitPrice: 2.75, total: 2750.00, packageTag: '1A4060300000022000017502' },
    ],
    subtotal: 11750.00,
    taxRate: 0.0,
    taxAmount: 0,
    discount: 0,
    total: 11750.00,
    amountPaid: 0,
    amountDue: 11750.00,
    createdAt: '2026-02-01T08:00:00Z',
    deliveryDate: '2026-02-03T10:00:00Z',
    dueDate: '2026-03-03T08:00:00Z',
    paidAt: null,
    paymentTerms: 'net-30',
    notes: 'Payment overdue. Follow-up email sent 3/10.',
    manifestNumber: '0000001245',
    noticeOfDefaultSent: true,
    dateNoticeSent: '2026-03-10T09:00:00Z',
  },
  {
    id: 'inv-010',
    invoiceNumber: 'INV-2026-0010',
    invoiceType: 'standard',
    status: 'overdue',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-001',
    receiverFacilityId: 'fac-004',
    market: 'CO',
    items: [
      { id: 'li-010a', productName: 'OG Kush Live Resin', sku: 'PCE-CR-OGK-002', category: 'Concentrate', quantity: 300, unitPrice: 22.00, total: 6600.00, packageTag: '1A4060300000022000018001' },
      { id: 'li-010b', productName: 'Lavender Relief Balm', sku: 'PCE-TP-LRB-010', category: 'Topical', quantity: 150, unitPrice: 8.00, total: 1200.00, packageTag: '1A4060300000022000018002' },
      { id: 'li-010c', productName: 'Blue Dream Pre-Roll Singles', sku: 'PCE-PR-BD-002', category: 'Pre-Roll', quantity: 400, unitPrice: 2.50, total: 1000.00, packageTag: '1A4060300000022000018003' },
    ],
    subtotal: 8800.00,
    taxRate: 0.0725,
    taxAmount: 638.00,
    discount: 0,
    total: 9438.00,
    amountPaid: 0,
    amountDue: 9438.00,
    createdAt: '2026-01-25T15:00:00Z',
    deliveryDate: '2026-01-27T14:00:00Z',
    dueDate: '2026-03-11T15:00:00Z',
    paidAt: null,
    paymentTerms: 'net-45',
    notes: 'Net-45 terms. Now 10 days overdue. Collections flag pending.',
    manifestNumber: '0000001220',
    noticeOfDefaultSent: true,
    dateNoticeSent: '2026-03-18T09:00:00Z',
  },

  // --- DRAFT (1) ---
  {
    id: 'inv-011',
    invoiceNumber: 'INV-2026-0011',
    invoiceType: 'credit-memo',
    status: 'draft',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-001',
    receiverFacilityId: 'fac-004',
    market: 'CO',
    items: [
      { id: 'li-011a', productName: 'Blue Dream Premium Flower', sku: 'PCE-FL-BD-001', category: 'Flower', quantity: 1500, unitPrice: 5.50, total: 8250.00, packageTag: '1A4060300000022000019001' },
      { id: 'li-011b', productName: 'Mango Bliss Gummies', sku: 'PCE-ED-MBG-004', category: 'Edible', quantity: 600, unitPrice: 4.50, total: 2700.00, packageTag: '1A4060300000022000019002' },
    ],
    subtotal: 10950.00,
    taxRate: 0.0725,
    taxAmount: 793.88,
    discount: 0,
    total: 11743.88,
    amountPaid: 0,
    amountDue: 11743.88,
    createdAt: '2026-03-19T16:00:00Z',
    deliveryDate: '',
    dueDate: '2026-04-18T16:00:00Z',
    paidAt: null,
    paymentTerms: 'net-30',
    notes: 'Draft — awaiting final line item confirmation from Mountain View.',
    manifestNumber: '0000001390',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },

  // --- VOIDED (1) ---
  {
    id: 'inv-012',
    invoiceNumber: 'INV-2026-0012',
    invoiceType: 'standard',
    status: 'voided',
    senderOrgId: 'org-005',
    receiverOrgId: 'org-003',
    senderFacilityId: 'fac-006',
    receiverFacilityId: 'fac-004',
    market: 'WA',
    items: [
      { id: 'li-012a', productName: 'Sour Diesel Outdoor Flower', sku: 'EVF-FL-SD-001', category: 'Flower', quantity: 800, unitPrice: 4.00, total: 3200.00, packageTag: '1A4060300000022000019501' },
      { id: 'li-012b', productName: 'OG Kush Outdoor Flower', sku: 'EVF-FL-OGK-001', category: 'Flower', quantity: 500, unitPrice: 4.00, total: 2000.00, packageTag: '1A4060300000022000019502' },
    ],
    subtotal: 5200.00,
    taxRate: 0.065,
    taxAmount: 338.00,
    discount: 0,
    total: 5538.00,
    amountPaid: 0,
    amountDue: 0,
    createdAt: '2026-02-05T12:00:00Z',
    deliveryDate: '2026-02-07T10:00:00Z',
    dueDate: '2026-02-20T12:00:00Z',
    paidAt: null,
    paymentTerms: 'net-15',
    notes: 'Voided — duplicate of INV-2026-0003. Created in error.',
    manifestNumber: '0000001256',
    noticeOfDefaultSent: false,
    dateNoticeSent: null,
  },
]

export const transactions: Transaction[] = [
  // INV-0001 (paid) — single payment
  {
    id: 'txn-001',
    invoiceId: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    type: 'payment',
    amount: 26383.50,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-02-24T14:32:00Z',
    reference: 'ACH-2026-0441',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-001',
  },
  // INV-0002 (paid) — single wire payment
  {
    id: 'txn-002',
    invoiceId: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    type: 'payment',
    amount: 36159.38,
    status: 'completed',
    method: 'wire',
    timestamp: '2026-03-02T10:08:00Z',
    reference: 'WIRE-2026-0087',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-002',
  },
  // INV-0003 (paid) — single ACH payment
  {
    id: 'txn-003',
    invoiceId: 'inv-003',
    invoiceNumber: 'INV-2026-0003',
    type: 'payment',
    amount: 5591.25,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-02-20T16:45:00Z',
    reference: 'ACH-2026-0398',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-005',
  },
  // INV-0004 (partial) — two payments so far
  {
    id: 'txn-004',
    invoiceId: 'inv-004',
    invoiceNumber: 'INV-2026-0004',
    type: 'payment',
    amount: 20000.00,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-02-28T09:15:00Z',
    reference: 'ACH-2026-0455',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-001',
  },
  {
    id: 'txn-005',
    invoiceId: 'inv-004',
    invoiceNumber: 'INV-2026-0004',
    type: 'payment',
    amount: 10000.00,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-03-14T11:30:00Z',
    reference: 'ACH-2026-0512',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-001',
  },
  // INV-0005 (partial) — one payment, one pending
  {
    id: 'txn-006',
    invoiceId: 'inv-005',
    invoiceNumber: 'INV-2026-0005',
    type: 'payment',
    amount: 10000.00,
    status: 'completed',
    method: 'check',
    timestamp: '2026-03-01T14:00:00Z',
    reference: 'CHK-4821',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-002',
  },
  {
    id: 'txn-007',
    invoiceId: 'inv-005',
    invoiceNumber: 'INV-2026-0005',
    type: 'payment',
    amount: 7325.00,
    status: 'pending',
    method: 'ach',
    timestamp: '2026-03-18T08:00:00Z',
    reference: 'ACH-2026-0530',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-002',
  },
  // Additional standalone transactions
  {
    id: 'txn-008',
    invoiceId: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    type: 'refund',
    amount: 650.00,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-03-03T10:20:00Z',
    reference: 'ACH-2026-0468',
    senderOrgId: 'org-001',
    receiverOrgId: 'org-003',
  },
  {
    id: 'txn-009',
    invoiceId: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    type: 'adjustment',
    amount: -250.00,
    status: 'completed',
    method: 'wire',
    timestamp: '2026-03-04T15:45:00Z',
    reference: 'WIRE-2026-0089',
    senderOrgId: 'org-002',
    receiverOrgId: 'org-004',
  },
  // Failed payment attempt on overdue INV-0009
  {
    id: 'txn-010',
    invoiceId: 'inv-009',
    invoiceNumber: 'INV-2026-0009',
    type: 'payment',
    amount: 11750.00,
    status: 'failed',
    method: 'ach',
    timestamp: '2026-03-05T09:00:00Z',
    reference: 'ACH-2026-0478',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-002',
  },
  // Pending payment on INV-0006
  {
    id: 'txn-011',
    invoiceId: 'inv-006',
    invoiceNumber: 'INV-2026-0006',
    type: 'payment',
    amount: 33462.00,
    status: 'pending',
    method: 'ach',
    timestamp: '2026-03-20T10:00:00Z',
    reference: 'ACH-2026-0545',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-001',
  },
  // Wire for INV-0007
  {
    id: 'txn-012',
    invoiceId: 'inv-007',
    invoiceNumber: 'INV-2026-0007',
    type: 'payment',
    amount: 26625.00,
    status: 'pending',
    method: 'wire',
    timestamp: '2026-03-19T14:30:00Z',
    reference: 'WIRE-2026-0102',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-005',
  },
  // Check payment for INV-0010 (overdue, attempted)
  {
    id: 'txn-013',
    invoiceId: 'inv-010',
    invoiceNumber: 'INV-2026-0010',
    type: 'payment',
    amount: 9438.00,
    status: 'pending',
    method: 'check',
    timestamp: '2026-03-20T08:00:00Z',
    reference: 'CHK-4903',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-001',
  },
  // Misc completed payments
  {
    id: 'txn-014',
    invoiceId: 'inv-003',
    invoiceNumber: 'INV-2026-0003',
    type: 'adjustment',
    amount: -75.00,
    status: 'completed',
    method: 'ach',
    timestamp: '2026-02-22T11:00:00Z',
    reference: 'ACH-2026-0405',
    senderOrgId: 'org-005',
    receiverOrgId: 'org-003',
  },
  {
    id: 'txn-015',
    invoiceId: 'inv-004',
    invoiceNumber: 'INV-2026-0004',
    type: 'payment',
    amount: 33890.63,
    status: 'pending',
    method: 'wire',
    timestamp: '2026-03-21T09:00:00Z',
    reference: 'WIRE-2026-0110',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-001',
  },
  {
    id: 'txn-016',
    invoiceId: 'inv-008',
    invoiceNumber: 'INV-2026-0008',
    type: 'payment',
    amount: 48937.50,
    status: 'pending',
    method: 'wire',
    timestamp: '2026-03-21T10:30:00Z',
    reference: 'WIRE-2026-0112',
    senderOrgId: 'org-004',
    receiverOrgId: 'org-001',
  },
  {
    id: 'txn-017',
    invoiceId: 'inv-009',
    invoiceNumber: 'INV-2026-0009',
    type: 'payment',
    amount: 11750.00,
    status: 'pending',
    method: 'ach',
    timestamp: '2026-03-18T16:00:00Z',
    reference: 'ACH-2026-0538',
    senderOrgId: 'org-003',
    receiverOrgId: 'org-002',
  },
  {
    id: 'txn-018',
    invoiceId: 'inv-012',
    invoiceNumber: 'INV-2026-0012',
    type: 'refund',
    amount: 0,
    status: 'reversed',
    method: 'ach',
    timestamp: '2026-02-06T09:00:00Z',
    reference: 'ACH-2026-0370',
    senderOrgId: 'org-005',
    receiverOrgId: 'org-003',
  },
]

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm-001', type: 'ach', label: 'Primary Checking (ACH)', bankName: 'Pacific Premier Bank', last4: '4821', isDefault: true },
  { id: 'pm-002', type: 'wire', label: 'Wire Transfer', bankName: 'First Republic Bank', last4: '7733', isDefault: false },
  { id: 'pm-003', type: 'check', label: 'Business Checking', bankName: 'Pacific Premier Bank', last4: '4821', isDefault: false },
]

export const invoiceStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'partial', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'voided', label: 'Voided' },
]

export const paymentTermsOptions = [
  { value: 'all', label: 'All Terms' },
  { value: 'due-on-receipt', label: 'Due on Receipt' },
  { value: 'net-15', label: 'Net 15' },
  { value: 'net-30', label: 'Net 30' },
  { value: 'net-45', label: 'Net 45' },
  { value: 'net-60', label: 'Net 60' },
]

export const marketOptions = [
  { value: 'CA', label: 'California' },
  { value: 'OR', label: 'Oregon' },
  { value: 'CO', label: 'Colorado' },
  { value: 'WA', label: 'Washington' },
  { value: 'NV', label: 'Nevada' },
  { value: 'MI', label: 'Michigan' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MA', label: 'Massachusetts' },
]

// =============================================================================
// MONTHLY FINANCIAL DATA — Cash flow visualization
// =============================================================================

export interface MonthlyFinancial {
  month: string       // Short month label (Jan, Feb, etc.)
  monthFull: string   // Full month name
  income: number
  expenses: number
}

export const monthlyFinancials: MonthlyFinancial[] = [
  { month: 'Jul', monthFull: 'July 2025', income: 68200, expenses: 34800 },
  { month: 'Aug', monthFull: 'August 2025', income: 72500, expenses: 38200 },
  { month: 'Sep', monthFull: 'September 2025', income: 78900, expenses: 41500 },
  { month: 'Oct', monthFull: 'October 2025', income: 82300, expenses: 43200 },
  { month: 'Nov', monthFull: 'November 2025', income: 76800, expenses: 40900 },
  { month: 'Dec', monthFull: 'December 2025', income: 88600, expenses: 46100 },
  { month: 'Jan', monthFull: 'January 2026', income: 71400, expenses: 37800 },
  { month: 'Feb', monthFull: 'February 2026', income: 79200, expenses: 42600 },
  { month: 'Mar', monthFull: 'March 2026', income: 84500, expenses: 44200 },
]

export const financialSummary = {
  totalIncome: 702400,
  totalExpenses: 369300,
  netCashFlow: 333100,
  avgMonthlyIncome: 78044,
  avgMonthlyExpenses: 41033,
  incomeChange: 12,   // % vs prior period
  expenseChange: 5,   // % vs prior period
}
