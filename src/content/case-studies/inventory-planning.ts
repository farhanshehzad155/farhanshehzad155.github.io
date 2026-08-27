/** PRD section 8.4.5. Demand-driven manufacturing planner. */

import type { CaseStudy } from '../schema';

export const inventoryPlanning: CaseStudy = {
  slug: 'inventory-planning',
  title: 'Inventory and manufacturing planning',
  summary:
    'A planner that turns warehouse stock levels and projected demand into what needs manufacturing next.',
  metaDescription:
    'Turning warehouse stock levels and projected demand into manufacturing requirements, with a forecasting approach simple enough to explain and to trust.',
  organisation: 'Karmic Seed',
  clientSector: 'A US wellness brand manufacturing and shipping its own products',
  role: 'Automation Engineer',
  period: { start: '2022-01', end: '2024-01' }, // TODO(LI): confirm.
  domain: 'ecommerce',
  featured: false,

  context:
    'A brand that manufactures what it sells, so a stockout is a production lead time away from being fixed rather than a reorder away. TODO(content): expand to 80-150 words.',

  problem:
    'Deciding what to manufacture next was a judgement call made against a spreadsheet of current stock. That works until the product range grows, at which point the person making the call is holding too many variables and the failure mode is either a stockout on something popular or capital tied up in something that is not moving.',

  // FR-IP2: state the forecasting approach honestly, including how simple it
  // was. An honest heuristic described well beats an implied ML system.
  contribution:
    'I built the planner: stock levels in, projected demand in, upcoming manufacturing requirements out. On the forecasting: TODO(content) — state plainly what the method actually was. If it was a moving average over recent sales with a lead-time buffer, say that. A simple method that is understood and trusted gets used, and a sophisticated one that nobody can explain does not.',

  constraints: [
    'Manufacturing lead time means the planner has to look far enough ahead to be actionable, not merely report the present.',
    'The output is read by people making a purchasing decision, so it has to be explainable. A number nobody can interrogate does not get acted on.',
    'TODO(content): add the remaining real constraints, including data quality on the stock side.',
  ],

  outcomes: [
    {
      value: '',
      label:
        'Replaced a manual spreadsheet judgement with a repeatable calculation that can be re-run as stock and demand move.',
      tier: 'capability',
    },
  ],

  whatDidNotWork:
    'TODO(content): required (rule CV-2). Forecasting is a rich source of honest answers here. Whatever the model was bad at, seasonality, a new product with no history, a demand spike it could not have seen, is worth naming.',

  stack: [
    { name: 'Python', rationale: 'The work is tabular data manipulation, which is where the tooling is.' },
    {
      name: 'Scrapy',
      rationale:
        'Used for the adjacent competitor price-monitoring system (FR-IP3), a scheduled cloud-run scraper built alongside this planner.',
    },
  ],

  readingMinutes: 5,
};
