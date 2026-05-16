# O34-S5: Deals, Analytics, Marketplace Translations

## Context

S1-S4 built the i18n infrastructure and translated the app shell, settings pages, 26 shared modals, and the campaigns module (~752 keys). S5 translates 3 more modules: Deals (18 files), Analytics (18 files), Marketplace (14 files). ~369 new keys across 3 new namespaces.

## Wave 1 — Message Files

**Files:** `messages/en.json`, `messages/de.json`

Add 3 namespaces: `deals` (~150 keys), `analytics` (~147 keys), `marketplace` (~72 keys).

### `deals` namespace (~150 keys)

| Prefix | ~Keys | Source |
|--------|-------|--------|
| `status_` | 5 | DealStatusBadge (pending_review, needs_more_info, approved, rejected, expired) |
| `source_` | 2 | DealSource (partner_submitted, account_mapping) |
| `timeline_` | 5 | Timeline display map |
| `deal_type_` | 2 | DealType (new_business, existing_business) |
| `stage_` | 8 | OpportunityStage (prospect, discovery, demo, negotiation, closing, won, closed_won, closed_lost) |
| `group_` | 3 | DealGroups (prospect_info, deal_details, bant_qualification) |
| `dashboard_` | 5 | DealsDashboard |
| `table_` | 18 | DealTable, AllPartnerDealsTable, SinglePartnerDealsTable |
| `single_` | 25 | SingleDealPage |
| `register_` | 10 | RegisterDeal modal, RegisterDealButton |
| `reject_` | 5 | RejectDeal modal |
| `confirm_approve_` | 3 | ConfirmDealApproval modal |
| `confirm_reject_` | 3 | ConfirmDealRejection modal |
| `response_` | 4 | DealResponse modal |
| `request_info_` | 5 | RequestInfo modal |
| `drawer_` | 3 | DealInfoDrawer |
| `info_` | 10 | DealInfo |
| `docs_` | 2 | DealDocs |
| `field_` | 15 | Field labels for GridBox (prospect_company_name, contact_email_address, etc.) |

### `analytics` namespace (~147 keys)

| Prefix | ~Keys | Source |
|--------|-------|--------|
| `header_` | 3 | AnalyticsHeaderActions |
| `ratings_` | 4 | AnalyticsRatings |
| `pipeline_` | 5 | PipelineTrendChart |
| `revenue_` | 5 | RevenueTrendChart |
| `deal_flow_` | 8 | DealFlowChart |
| `conversion_` | 4 | ConversionFunnel |
| `overall_targets_` | 12 | OverallTargets |
| `partner_perf_` | 10 | PartnerPerformanceTable |
| `sales_perf_` | 10 | SalesPeoplePerformanceTable |
| `contribution_` | 10 | SalesPeopleContributionTable |
| `target_assignment_` | 14 | TargetAssignmentTable |
| `target_breakdown_` | 5 | TargetBreakdown |
| `target_overview_` | 3 | TargetOverviewCards |
| `period_` | 20 | PeriodSelector |

### `marketplace` namespace (~72 keys)

| Prefix | ~Keys | Source |
|--------|-------|--------|
| `header_` | 5 | MarketPlaceHeader |
| `tabs_` | 16 | MarketPlaceTabs (includes filter field labels) |
| `table_` | 8 | MarketPlaceTable |
| `profile_` | 14 | CompanyProfileCard |
| `proposition_` | 14 | JointValueProposition |
| `drawer_` | 10 | PropositionDrawer |
| `contacts_` | 7 | MContactList |
| `contact_menu_` | 2 | ContactListMenu |
| `edit_contacts_` | 10 | MPartnerEditContacts |
| `saved_list_` | 4 | SavedListTable + SavedContactListTable |
| `permission_` | 1 | Marketplace |

### ICU patterns

- `"dashboard_partner_deals": "{name} Deals"` — interpolation
- `"table_selected_count": "{count, plural, one {# partner selected} other {# partners selected}}"` — pluralization
- `"target_breakdown_achieved": "{orgName} has achieved {percent}% of its target."` — interpolation
- `"drawer_products_label": "Partner Products ({count}/10)"` — interpolation
- `"response_message": "You have {type} current deal with {companyName}."` — interpolation

## Wave 2 — Deals Module (18 files)

### Modal title migration (5 modals)

Move title from `openContextModal({ title: <FeatureHeader /> })` into modal body. Same pattern as S3/S4.

| Modal | Current title |
|-------|--------------|
| `RegisterDeal.tsx` | "Register New Deal" + description |
| `RejectDeal.tsx` | "Reject Deal Registration" + description |
| `RequestInfo.tsx` | "Request Additional Information" + description |
| `ConfirmDealApproval.tsx` | "Are you sure you want to approve deal?" |
| `ConfirmDealRejection.tsx` | "Are you sure you want to reject deal?" |

`DealResponse.tsx` — already no title in launcher, just translate inner strings.

### Display map translation strategy

Deal status/source/stage display maps in `types.ts` are plain objects. Instead of translating the maps (non-component context), translate at render time:
- In components: `t("status_" + status.toLowerCase())` instead of `dealStatusDisplayMap[status]`
- For filter options: build translated options inline with `useTranslations`

### Component wiring

| File | Key changes |
|------|-------------|
| `DealStatusBadge.tsx` | Replace `titleCase(status)` → `t("status_" + status.toLowerCase())` |
| `DealTable.tsx` | 9 column headers, title, filter button, error/empty messages |
| `DealsDashboard.tsx` | Title, description, button, partner deals title with ICU |
| `AllPartnerDealsTable.tsx` | 6 filter field labels |
| `SinglePartnerDealsTable.tsx` | 4 filter labels + empty state |
| `SingleDealPage.tsx` | Breadcrumbs, tooltips, buttons, section titles, status labels (~25 keys) |
| `GridBox.tsx` | Add optional `fieldLabels?: Record<string, string>` prop; use instead of `titleCase(key)` |
| `DealInfo.tsx` | Dropzone text, processing states, form labels |
| `DealInfoDrawer.tsx` | Drawer title, tab labels |
| `DealDocs.tsx` | Empty state title/description |
| `RegisterDealButton.tsx` | Default "Register Deal" text |
| `DealForm.tsx` | "Unknown Vendor Contact" fallback |

### Files
- **Modify:** All 12 components in `modules/deals/components/`
- **Modify:** All 6 modals in `modules/deals/modals/`

## Wave 3 — Analytics Module (14 active files, 4 skip)

**Skip (no strings):** AnalyticDashboard.tsx, AnalyticsContext.tsx, TargetProgress.tsx, AnalyticsTargetPage.tsx

| File | Key changes |
|------|-------------|
| `AnalyticsHeaderActions.tsx` | "All partners", "Export PDF", "Manage Targets" |
| `AnalyticsRatings.tsx` | 4 rating card titles |
| `PipelineTrendChart.tsx` | Chart title, period toggles, total label |
| `RevenueTrendChart.tsx` | Chart title, period toggles, total label |
| `DealFlowChart.tsx` | Chart title, period toggles, 5 dataset labels |
| `ConversionFunnel.tsx` | Title + funnel step name lookup |
| `OverallTargets.tsx` | Title, description, 6 role-variant target card titles |
| `PartnerPerformanceTable.tsx` | Title, search, 6 columns, loading/empty |
| `SalesPeoplePerformanceTable.tsx` | Title, search, 6 columns, loading/empty |
| `SalesPeopleContributionTable.tsx` | Title, 5 columns, filter, error/empty |
| `TargetAssignmentTable.tsx` | Title, button, tooltip, 6 columns, 3 menu items, error/empty |
| `TargetBreakdown.tsx` | Title, ICU achieved text, 3 target cards |
| `TargetOverviewCards.tsx` | 3 card titles |
| `PeriodSelector.tsx` | Period/range labels (~20 keys), summary texts |

### Files
- **Modify:** 14 components in `modules/analytics/components/`

## Wave 4 — Marketplace Module (11 active files, 3 skip)

**Skip (no strings):** MContactListPage.tsx, SavedListPage.tsx, Marketplace.tsx (1 permission string — include if trivial)

| File | Key changes |
|------|-------------|
| `MarketPlaceHeader.tsx` | Title, description, button, menu items |
| `MarketPlaceTabs.tsx` | Title, search, filter button, tooltip, 10 field labels, 3 filter options |
| `MarketPlaceTable.tsx` | Select all, ICU plural selected count, empty states |
| `CompanyProfileCard.tsx` | Section title, 11 profile labels, 2 link texts |
| `JointValueProposition.tsx` | Title, loading, empty states, buttons, tooltips, section titles |
| `PropositionDrawer.tsx` | Drawer title, ICU product count, form labels/placeholders, buttons |
| `MContactList.tsx` | Title, tooltips, search, export, error/empty |
| `ContactListMenu.tsx` | Tooltip, menu item |
| `MPartnerEditContacts.tsx` | Title, loading, empty, badge, tooltips, buttons, success notification |
| `SavedListTable.tsx` | Empty state titles/descriptions |
| `SavedContactListTable.tsx` | Empty state titles/descriptions |

### Files
- **Modify:** 11 components in `components/marketplace/`

## Verification

1. `yarn typecheck` — zero new errors
2. `yarn eslint . --quiet` — zero new warnings
3. Key parity: en.json and de.json have matching key sets across all 3 new namespaces
4. **Deals at `/de/`:** DealsDashboard title in German, DealTable headers translated, open RegisterDeal modal → German form
5. **Analytics at `/de/`:** Chart titles, period selector labels, table headers all in German
6. **Marketplace at `/de/`:** MarketPlaceHeader, partner table, CompanyProfileCard labels in German
