import type { Project } from '../../types';

interface ProjectsPageProps {
  projects: Project[];
  onNewProject: () => void;
  onOpenProject: (projectId: string) => void;
}

export function ProjectsPage({ projects, onNewProject, onOpenProject }: ProjectsPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">
              All Projects
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New Project tile */}
          <button
            type="button"
            onClick={onNewProject}
            className="h-44 rounded-xl border border-dashed border-[var(--color-border)] hover:border-white/20 bg-[var(--color-surface)]/20 flex items-center justify-center text-[var(--color-text-secondary)]"
          >
            + New Project
          </button>

          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenProject(p.id)}
              className="h-44 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden text-left hover:border-white/20 transition-colors"
            >
              <div
                className={p.coverUrl ? 'h-24' : 'h-24 bg-gradient-to-br from-white/10 to-white/0'}
                style={
                  p.coverUrl
                    ? {
                        backgroundImage: `url(${p.coverUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined
                }
              />
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      {p.folderLabel ? `Label: ${p.folderLabel}` : 'Label: —'} · {p.template}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-md hover:bg-white/5 text-[var(--color-text-secondary)]"
                    aria-label="Project actions"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    ⋯
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
