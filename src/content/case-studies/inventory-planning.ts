/**
 * PRD section 8.4.5. Demand-driven manufacturing planner.
 *
 * Drawn from Farhan's own Karmic Seed role bullets, supplied 28 Aug 2026.
 *
 * FR-IP2 asks for the forecasting approach to be stated honestly, including
 * how simple it was. The method itself has not been supplied, so the approach
 * body describes what the planner does without characterising the maths. That
 * is the honest position: better to describe less than to imply a model that
 * was never there.
 */

import type { CaseStudy } from '../schema';

export const inventoryPlanning: CaseStudy = {
  slug: 'inventory-planning',
  title: 'Inventory and manufacturing planning',
  summary:
    'A planner that turns warehouse stock levels and projected demand into what needs manufacturing next, replacing a manual spreadsheet step.',
  metaDescription:
    'Turning warehouse stock levels and projected demand into upcoming manufacturing requirements, plus the cloud price monitor built alongside it.',
  organisation: 'Karmic Seed LLC',
  role: 'Automation & Integration Specialist',
  period: { start: '2022-07', end: '2025-02' },
  domain: 'ecommerce',
  featured: false,

  context:
    'A business that manufactures what it sells rather than reselling it. That changes the arithmetic of running out: a stockout is a production lead time away from being fixed, not a reorder away. Deciding what to make next therefore has to happen well before the shelf looks empty, and it has to happen for every product at once.',

  problem:
    'The decision was being made against a spreadsheet of current stock levels, by a person holding the rest in their head. That works until the product range grows, at which point the number of variables exceeds what anyone can hold at once and the failure modes arrive together: a stockout on something popular, and capital tied up in something that is not moving. Both are expensive, and neither is visible until it has already happened.',

  contribution:
    'I built the planning workflow: warehouse stock levels in, projected demand in, upcoming manufacturing requirements out, on a schedule rather than when somebody remembered. The output is a list of what to make and roughly when, produced the same way every time, which is the property that matters. A planning number that can be re-derived is one a person can argue with; a number that came out of somebody’s judgement last Tuesday is one they can only accept or ignore. I also built the competitor price monitoring system that ran alongside it, a cloud-scheduled Python and Scrapy scraper tracking marketplace pricing to inform pricing decisions. Separate build, related problem: both exist so a recurring commercial decision stops depending on somebody remembering to go and look.',

  constraints: [
    'Manufacturing lead time means the planner has to look far enough ahead to be actionable. Reporting the present accurately is not useful here.',
    'The output is read by a person about to commit money to a production run, so it has to be explainable. A number nobody can interrogate does not get acted on.',
    'Stock data quality is whatever the warehouse system says it is, and the planner has to be useful despite that rather than assume it away.',
  ],

  outcomes: [
    {
      value: '',
      label:
        'Replaced a manual spreadsheet judgement with a repeatable calculation that can be re-run as stock and demand move.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Planning output is derived the same way every time, so it can be questioned rather than only accepted.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'A cloud-scheduled competitor price monitor built alongside it, tracking marketplace pricing continuously.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork absent by design — see the note on the field in schema.ts.
  // Forecasting is a rich source of honest answers, and this page is weaker for
  // not having one.

  stack: [
    {
      name: 'Python',
      rationale: 'The work is tabular data manipulation, which is where the tooling is.',
    },
    {
      name: 'Scrapy',
      rationale:
        'For the adjacent price monitor. Chosen over a scripted browser because the target was structured pages at volume, not an application that needed driving.',
    },
    { name: 'Cloud scheduling' },
  ],

  readingMinutes: 5,
};
