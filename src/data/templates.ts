import type { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with a clean workspace.',
    icon: '⬜️',
    features: ['Custom workflow'],
  },
  {
    id: 'filmmaker',
    name: 'Filmmaker',
    description: 'Complete toolkit for film and video production with timeline management, shot lists, and crew coordination.',
    icon: '🎬',
    features: ['Shot List Management', 'Timeline & Schedule', 'Crew Coordination', 'Location Scouting'],
  },
  {
    id: 'vfx',
    name: 'VFX',
    description: 'Visual effects pipeline with asset tracking, version control, and render management.',
    icon: '✨',
    features: ['Asset Pipeline', 'Version Control', 'Render Queue', 'Compositing Workflows'],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Game development workflow with milestone tracking, build management, and QA integration.',
    icon: '🎮',
    features: ['Milestone Tracking', 'Build Pipeline', 'Bug Tracking', 'Playtesting'],
  },
  {
    id: 'live-sports',
    name: 'Live Sports',
    description: 'Real-time production management for live events with instant replay and multi-camera coordination.',
    icon: '🏆',
    features: ['Multi-Camera Setup', 'Instant Replay', 'Graphics Integration', 'Live Switching'],
  },
];
