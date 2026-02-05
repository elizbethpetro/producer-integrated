export type TemplateType = 'blank' | 'filmmaker' | 'vfx' | 'gaming' | 'live-sports';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ProjectDetails {
  name: string;
  description: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  teamSize?: string;
}

export interface ProjectData {
  template: TemplateType | null;
  details: ProjectDetails;
}

export type Step = 'template-selection' | 'project-details' | 'confirmation';

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
  assignee?: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  tasks: ProjectTask[];
}

export interface ProjectFileItem {
  id: string;
  name: string;
  size: number;
  type?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  role?: string;
}

export interface WorkstationLink {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  id: string;
  template: TemplateType;
  name: string;
  folderLabel: string;
  driveLetter: string;
  coverUrl: string | null;
  plan: ProjectPhase[];
  files: ProjectFileItem[];
  members: ProjectMember[];
  workstations: WorkstationLink[];
  createdAt: string;
}
