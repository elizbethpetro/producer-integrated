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

export function defaultPlanForTemplate(template: TemplateType): ProjectPhase[] {
  switch (template) {
    case 'blank':
      return [phase('Getting started', ['Define scope', 'Create milestones', 'Invite team'])];
    case 'filmmaker':
      return [
        phase('Pre-production', [
          'Script breakdown',
          'Create shot list',
          'Build schedule',
          'Crew list & contacts',
        ]),
        phase('Production', ['Daily call sheets', 'Track footage', 'Manage locations', 'Log notes']),
        phase('Post-production', ['Ingest & organize', 'Rough cut', 'Sound', 'Color', 'Delivery']),
      ];
    case 'vfx':
      return [
        phase('Development', ['Storyboard', 'Concept', 'Producer', 'Director']),
        phase('Pre-Production', ['Line Producer', 'Crew', 'Casting', 'Location', 'Shooting Schedule']),
        phase('Production', []),
        phase('Post-Production', ['Clip 1 Rough Cut', 'Clip 2 Rough Cut', 'Final Cuts', 'Color And Sound']),
        phase('Delivery', ['Insta & Tiktok 9:16 / 4:5', 'Youtube 16:9', 'Copies For Postings']),
      ];
    case 'gaming':
      return [
        phase('Planning', ['Define milestones', 'Backlog grooming', 'Build schedule']),
        phase('Development', ['Feature work', 'Builds', 'Playtests']),
        phase('QA', ['Bug triage', 'Regression testing', 'Release candidate']),
      ];
    case 'live-sports':
      return [
        phase('Prep', ['Crew assignments', 'Run of show', 'Graphics package']),
        phase('Live', ['Checklists', 'Comms', 'Switching notes']),
        phase('Wrap', ['Export highlights', 'Archive footage', 'Post-mortem']),
      ];
  }
}
