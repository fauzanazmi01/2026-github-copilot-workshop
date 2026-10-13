# PO Backlog Runbook

## Scope

Implement the PO backlog only: list, create, and detail pages; PO API wiring; allocation validation; and focused tests. Preserve the existing PR baseline and reuse the existing PO APIs. Do not implement GR, change the schema, modify the PR workflow, or add bookmarks or enterprise features.

PO creation must use `GET /api/requisitions/:id/open-lines`, whose `qtyOpenForPo` values represent quantities available to allocate. `GET /api/purchase-orders/:id/open-lines` is for PO quantities open for the deferred GR flow; it is not the PO-create data source. E2E begins with an already-approved PR, not PR creation or approval.

## Strict Task Sequence

### 1. Verify the baseline

- Start PostgreSQL with `docker compose up -d db`; start the app with `npm run dev`.
- Confirm the PR pages work and approved PR data is available.
- Run the existing focused PO service tests before changing code.
- Resolve setup or baseline failures before proceeding.

**Checkpoint:** The app and PR baseline work, approved PR data is available, and the current PO service suite passes.

### 2. Close the allocation validation gap

- Add a regression test where a create request repeats one `prLineId` and the combined requested quantity exceeds that line's remaining quantity.
- Update `createPurchaseOrder()` to validate the combined quantity per PR line before writes.
- Preserve transaction handling, row locking, APPROVED status validation, missing-line handling, rollback/release behavior, and the exact-remaining success case.

**Checkpoint:** The focused PO service suite passes, including the new repeated-line rejection and existing success/failure cases.

### 3. Confirm and document the API contract

- Verify the existing PO collection list, create, detail, submit, and open-lines routes and response shapes. Reuse them; do not rebuild working endpoints.
- Add `GET /api/purchase-orders` to the PO API inventory in `docs/plan.md`, since the list page requires it.
- Keep the PR open-lines and PO open-lines purposes distinct as described in Scope.
- Do not add schema changes unless a confirmed contract gap requires one.

**Checkpoint:** Every planned UI action maps to an existing, verified endpoint; the API documentation matches the implementation.

### 4. Add frontend API methods and navigation

- Add PO list, create, detail, and submit methods to `frontend/src/api.js`.
- Reuse `getRequisitionOpenLines()` for the create flow.
- Register PO routes and navbar links in `frontend/src/router/index.js` and `frontend/src/App.vue`.
- Register `/purchase-orders/new` before `/purchase-orders/:id`.
- Use an approved-PR selector on the PO create page; do not require a new PR-detail action.

**Checkpoint:** `npm run build` passes from `frontend/`, and the PO routes resolve.

### 5. Implement the PO list page

- Add `PurchaseOrderListPage.vue`, following the PR list patterns for loading, errors, empty state, tables, and detail links.
- Show PO number, vendor, status, created date, and an entry to create a PO.

**Checkpoint:** The page loads `{ items }` from the existing list endpoint and handles loading, empty, and error states.

### 6. Implement PO creation

- Add `PurchaseOrderCreatePage.vue` with approved PR selection.
- Load the selected PR's open lines and show each line's remaining allocatable quantity.
- Build the request using the existing backend payload fields.
- Reject nonpositive quantities and quantities above the displayed remaining amount in the UI. Keep backend checks authoritative for stale or concurrent allocations.
- After successful creation, navigate to the PO detail page.

**Checkpoint:** Creating a PO from approved PR data works. An over-limit request displays the API error and creates no PO.

### 7. Implement PO detail and submit

- Add `PurchaseOrderDetailPage.vue` showing the PO header, vendor, status, lines, and PR allocation references.
- Show Submit only while status is `DRAFT`; call the submit endpoint and refresh the displayed PO.
- Handle missing records and API errors.
- Do not add GR actions or receipt views.

**Checkpoint:** PO detail loads and the `DRAFT` to `SUBMITTED` transition works.

### 8. Add focused Playwright coverage

- Add one PO journey using stable, already-approved PR test data: create PO, verify detail and allocation reference, submit, and verify `SUBMITTED`.
- Do not include PR creation/approval or GR.
- Keep test data isolated. Do not reset or reseed a developer's working database as part of routine E2E execution.

**Checkpoint:** The focused Playwright scenario passes repeatedly against an isolated, seeded test database.

### 9. Run final verification

- Run focused and full backend Jest suites.
- Run the frontend build and applicable frontend tests.
- Run the focused PO Playwright scenario.
- Smoke-test the existing PR flow to confirm the baseline is preserved.
- Review scope and confirm API documentation matches implementation.

**Checkpoint:** All applicable checks pass; no GR, schema, PR workflow, bookmark, or enterprise work was introduced.

## Verification Commands

Run backend commands from `backend/`. On Windows PowerShell, the package test script's POSIX-style `NODE_OPTIONS=...` assignment is not portable; use:

```powershell
$env:NODE_OPTIONS='--experimental-vm-modules'
npx jest --runInBand tests/services/purchase-order-service.test.js
npx jest --runInBand
```

Run frontend checks from `frontend/`:

```powershell
npm test
npm run build
```

Run the focused Playwright test from the repository root against the started app and isolated test database, for example:

```powershell
npx playwright test tests/e2e/purchase-order.spec.js
```

## Key Files

- `backend/src/services/purchase-order-service.js`: combined allocation validation.
- `backend/tests/services/purchase-order-service.test.js`: PO business-rule tests.
- `backend/src/routes/purchase-order-routes.js`: existing PO API contract to verify and reuse.
- `frontend/src/api.js`, `frontend/src/router/index.js`, `frontend/src/App.vue`: API wrappers and navigation.
- `frontend/src/pages/PurchaseOrderListPage.vue`, `PurchaseOrderCreatePage.vue`, `PurchaseOrderDetailPage.vue`: PO pages.
- `docs/plan.md`: API and workshop plan alignment.