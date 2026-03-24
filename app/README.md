# Prototype: CanoPay

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: RID (default) — all themes available via PrototypeToolbar
- **Device**: Desktop (1440px) with responsive mobile (375px)
- **Fidelity**: High-fi
- **Created**: 2026-03-21
- **Last updated**: 2026-03-21
- **Components Used**: BrandBanner (added to dashboard greeting)

## Sources
- Confluence: [Payments Canopy (Space Home)](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701524)
- Confluence: [Payments Canopy Overview](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701650)
- Confluence: [Payments UX Considerations](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701621)
- Confluence: [Payments Key Concepts and Utilities](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701568)
- Confluence: [User Access Use Case Examples](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701585)
- Confluence: [User Access Visualization](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701597)
- Confluence: [Payments Canopy Relationships](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701608)
- Confluence: [Payments Initial Thoughts](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701554)
- Confluence: [Transfer Invoices - Research](https://metrc-tech.atlassian.net/wiki/spaces/PM/pages/427360257/Transfer+Invoices+-+Research) (PM space, Kristin Kilroy — detailed invoice model, phasing, NY OCM regulatory requirements, credit memos, COD enforcement)
- Confluence: [Payments Space (Home)](https://metrc-tech.atlassian.net/wiki/spaces/Payments/overview) (David Eagleson — separate Payments space, shell only as of Feb 2026)
- Confluence: [Payments Concept Docs](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701636) (empty template — no concept docs written yet)
- Jira: [PR-84 — Transfer Invoices](https://metrc-tech.atlassian.net/browse/PR-84)
- Notion: [Canopy Ecosystem Repository Architecture](https://www.notion.so/32957fbfbd0d811db377e29baf424df7)
- Figma: [Canopy Entity Relationships](https://www.figma.com/board/kJhyUtAzk1wYV81VNXFes4/Canopy)
- Figma: [Canopy Future Vision - Navigation](https://www.figma.com/board/nutUCspeocycMXk2MDGrgK/Canopy-Future-Vision?node-id=121-2191)
- Figma: [Canopy Future Vision - Onboarding](https://www.figma.com/board/nutUCspeocycMXk2MDGrgK/Canopy-Future-Vision?node-id=123-2876)
- Figma Make: [Canopy Prototype MVP](https://www.figma.com/make/en9VAfnNhRa3vhEHMhUvtg/Canopy-Prototype--MVP-)

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Dashboard | /prototypes/canopy-payments/dashboard | Complete | Stats, recent transactions, pending invoices |
| Invoices | /prototypes/canopy-payments/invoices | Complete | DataTable with filters, search, card view |
| Invoice Detail | /prototypes/canopy-payments/invoice-detail | Complete | Tabs: Line Items, Payment History, Details |
| Create Invoice | /prototypes/canopy-payments/create-invoice | Complete | 4-step LinearStepper form |
| Purchases | /prototypes/canopy-payments/purchases | Complete | Coming soon placeholder with planned features |
| Transactions | /prototypes/canopy-payments/transactions | Complete | Coming soon placeholder with planned features |

## Components Created
- None — all screens use existing DS components

## Decisions
- 2026-03-21: RID theme selected as default — differentiates from Registry (University) while maintaining Canopy identity
- 2026-03-21: Desktop-first with responsive mobile breakpoint, same as Registry
- 2026-03-21: MVP scope: Dashboard + Invoices + Invoice Detail + Create Invoice
- 2026-03-21: Follows exact same DS patterns as Canopy Registry prototype (layout, DataTable, LinearStepper, PrototypeToolbar)
- 2026-03-21: B2B cannabis supply chain focus — invoices between cultivators, manufacturers, distributors, retailers
- 2026-03-21: CanoPay is Phase 2 in Canopy MVP scope (per Confluence overview)
- 2026-03-21: Separate repo architecture planned (per Notion architecture doc) — prototype lives in DS for now
- 2026-03-22: Added Purchases and Transactions as "Coming Soon" pages with planned feature lists — nav items now linked

## Accessibility
- All pages: PrototypeToolbar for reviewer testing (theme + state switching)
- Forms: inline error messages with role="alert"
- DataTables: sortable columns, keyboard accessible
- Focus states on all interactive elements
- ConfirmDialogs for destructive actions (void invoice)

## Open Questions
- How should declined/failed payments surface to the user?
- Should partial payments auto-calculate remaining balance?
- What payment methods will be supported at launch (ACH only, or also wire/check)?
- How does CanoPay integrate with existing Metrc Compliance transfer manifests?

## Context
- **Summary**: B2B payment facilitation for cannabis product movement. Handles invoicing, payment processing, and financial reconciliation across organizations in the Canopy ecosystem.
- **Documents**: See Sources above
- **Notes**: David Eagleson authored all Confluence specs. Architecture: separate repos per app, DS consumed as file: dependency. CanoPay is one of 3 core Canopy utilities alongside Registry and Retail ID.

## Prompts
1. [2026-03-21] "Create CanoPay prototype based on Canopy ecosystem architecture and Confluence Payments specs. MVP scope, high-fi, RID default theme, responsive desktop, following exact DS patterns from Canopy Registry prototype."
   - Links: [Confluence: Payments Canopy Overview](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701650), [Confluence: Payments UX Considerations](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/631701621), [Notion: Canopy Repository Architecture](https://www.notion.so/32957fbfbd0d811db377e29baf424df7)
2. [2026-03-21] "Add a brand banner on the dashboard: Hello [Name], see what's going on in CanoPay today!"
3. [2026-03-21] "Add cash flow data visualization chart to dashboard — income vs expenses area chart with smooth curves, tooltips, summary cards, and avg monthly stats"
4. [2026-03-22] "Create coming soon pages for purchases and transactions"
5. [2026-03-21] "Left nav must go all the way down; remove the heading CANOPY on the left nav"
