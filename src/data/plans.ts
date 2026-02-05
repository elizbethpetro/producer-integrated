import type { ProjectPhase, TemplateType } from '../types';

function makeId() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function phase(title: string, tasks: string[]): ProjectPhase {
  return {
    id: makeId(),
    title,
    tasks: tasks.map((t) => ({ id: makeId(), title: t, done: false })),
  };
}

export function defaultPlanForTemplate(_template: TemplateType): ProjectPhase[] {
  return [
    phase('Development', ['Storyboard', 'Concept', 'Producer', 'Director']),
    phase('Pre-Production', ['Line Producer', 'Crew', 'Casting', 'Location', 'Shooting Schedule']),
    phase('Production', []),
    phase('Post-Production', ['Clip 1 Rough Cut', 'Clip 2 Rough Cut', 'Final Cuts', 'Color And Sound']),
    phase('Delivery', ['Insta & Tiktok 9:16 / 4:5', 'Youtube 16:9', 'Copies For Postings']),
  ];
}
