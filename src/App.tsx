import { useMemo, useState } from 'react';
import { NewProjectModal } from './components/NewProjectModal/NewProjectModal';
import type { NewProjectPayload } from './components/NewProjectModal/NewProjectModal';
import { ProjectsPage } from './components/Projects/ProjectsPage';
import { ProjectView } from './components/ProjectView/ProjectView';
import { defaultPlanForTemplate } from './data/plans';
import type { Project } from './types';

function makeId() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) ?? null;
  }, [projects, activeProjectId]);

  const handleCreate = (payload: NewProjectPayload) => {
    const coverUrl = payload.coverFile ? URL.createObjectURL(payload.coverFile) : null;

    const next: Project = {
      id: makeId(),
      template: payload.template,
      name: payload.name,
      folderLabel: payload.folderLabel,
      driveLetter: payload.driveLetter,
      coverUrl,
      plan: defaultPlanForTemplate(payload.template),
      files: [],
      members: [],
      workstations: [],
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [next, ...prev]);
    setActiveProjectId(next.id);
    console.log('Project created:', payload);
  };

  const handleUpdateProject = (next: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === next.id ? next : p)));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {activeProject ? (
        <ProjectView
          project={activeProject}
          onBack={() => setActiveProjectId(null)}
          onUpdate={handleUpdateProject}
        />
      ) : (
        <ProjectsPage
          projects={projects}
          onNewProject={() => setIsNewProjectOpen(true)}
          onOpenProject={(id) => setActiveProjectId(id)}
        />
      )}

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default App;
