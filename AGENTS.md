# Copilot Instructions for This Workshop

## Objective
Build a procurement management system with core modules for Purchase Requisition (PR), Purchase Order (PO), and Goods Receipt (GR).
A procurement system manages how a company buys things, with control and traceability from request to receiving.

The MVP scope includes:
- Purchase Requisition (PR): employees request items or services, which are reviewed and approved by managers.
- Purchase Order (PO): approved requisitions are converted into purchase orders sent to suppliers, tracking order details and status.
- Goods Receipt (GR): delivered items are recorded to confirm what was received, update inventory, and trigger payment.

This workshop uses the provided baseline and adds a focused backlog sprint. Reference plan: docs/plan.md.

## Scope Constraints (Strict)
- Baseline provided in repo: database schema + Home/Dashboard + PR module (list/create/detail + required PR APIs).
- Participant implementation scope: PO module only (PO list/create/detail + PO APIs + PO validations).
- GR is out of scope during the workshop and should be treated as future exploration.
- Keep the business scope minimal and teachable.
- Avoid enterprise-only features such as SSO, workflow engines, reporting, notifications, and advanced compliance.
- Favor clarity and small modules over abstraction-heavy patterns.

## Technology Decisions (Do Not Change)
- Backend: Fastify + JavaScript
- API style: REST JSON
- Database: PostgreSQL (Docker local)
- Frontend: Vue 3 + Vite + JavaScript
- Unit test: Jest
- E2E test: Playwright
- Do not use Prisma.

## API Requirements
- Maintain compatibility with endpoints listed in docs/plan.md.
- Prioritize PO endpoints for the backlog:
  - POST /api/purchase-orders
  - POST /api/purchase-orders/:id/submit
  - GET /api/purchase-orders/:id
  - GET /api/purchase-orders/:id/open-lines
- Enforce the PO rule: allocation qty <= PR line remaining qty.
- GR endpoints and rules remain untouched during the workshop unless explicitly extended later.

## Code Style Guidance
- Keep files short and readable for workshop participants.
- Use explicit naming and avoid clever or over-engineered patterns.
- Validate incoming requests and return clear, consistent errors.
- Prefer service functions for business logic and thin route handlers.
- Keep logic easy to explain in a workshop setting.

## Implementation Quality Checklist
- [ ] Scope stays within the PO backlog and does not expand into GR or enterprise features.
- [ ] Route handlers stay thin and delegate rules to services.
- [ ] Validation is explicit for required fields, status transitions, and business rules.
- [ ] Over-allocation checks and other PO rules are enforced consistently in all relevant flows.
- [ ] Code remains readable, small, and easy to discuss in a workshop.
- [ ] No dead code, unused abstractions, or speculative features are added.

## Testing Discipline
- [ ] Add focused Jest tests for PO business logic, especially over-allocation and status transitions.
- [ ] Cover both success and failure cases for key validation rules.
- [ ] Keep tests close to the real business behavior instead of testing mock-only behavior.
- [ ] Add minimal Playwright coverage for PO pages and flow integrated with the baseline PR data.
- [ ] Run the relevant tests before considering work complete.

## Documentation Discipline
- [ ] Keep API behavior and assumptions aligned with the implementation.
- [ ] Update docs only when they materially reflect the actual system behavior.
- [ ] Prefer short, explicit documentation over long speculative design notes.
- [ ] Document non-obvious business rules where they affect implementation or maintenance.
- [ ] Do not leave stale or contradictory guidance in the repo.

## Workshop-First Principle
When there is a trade-off between production robustness and workshop clarity, choose workshop clarity.

## Completion Standard
Before finishing work, confirm:
- implementation matches the agreed PO scope,
- tests cover the key validation and flow risks,
- documentation remains accurate and concise.