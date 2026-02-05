import { useMemo, useRef, useState } from 'react';
import type { Project, ProjectFileItem, ProjectMember, ProjectPhase, WorkstationLink } from '../../types';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  onUpdate: (next: Project) => void;
}

function makeId() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ProjectView({ project, onBack, onUpdate }: ProjectViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'plan' | 'files'>('plan');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [wsLabel, setWsLabel] = useState('');
  const [wsUrl, setWsUrl] = useState('');

  const driveBadge = useMemo(() => {
    const dl = project.driveLetter?.trim();
    if (!dl) return null;
    return `${dl.toUpperCase()}:`;
  }, [project.driveLetter]);

  const toggleTask = (phaseId: string, taskId: string) => {
    const nextPlan: ProjectPhase[] = project.plan.map((p) => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      };
    });

    onUpdate({ ...project, plan: nextPlan });
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const next: ProjectFileItem[] = Array.from(files).map((f) => ({
      id: makeId(),
      name: f.name,
      size: f.size,
      type: f.type,
    }));

    onUpdate({ ...project, files: [...next, ...project.files] });
  };

  const addMember = () => {
    const name = memberName.trim();
    if (!name) return;

    const next: ProjectMember = {
      id: makeId(),
      name,
      role: memberRole.trim() || undefined,
    };

    onUpdate({ ...project, members: [next, ...project.members] });
    setMemberName('');
    setMemberRole('');
  };

  const addWorkstation = () => {
    const label = wsLabel.trim();
    const url = wsUrl.trim();
    if (!label || !url) return;

    const next: WorkstationLink = { id: makeId(), label, url };
    onUpdate({ ...project, workstations: [next, ...project.workstations] });
    setWsLabel('');
    setWsUrl('');
  };

  const addTask = (phaseId: string, title: string) => {
    const nextPlan: ProjectPhase[] = project.plan.map((p) => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        tasks: [...p.tasks, { id: makeId(), title, done: false }],
      };
    });
    onUpdate({ ...project, plan: nextPlan });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] bg-black/20">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] hover:border-white/20 text-sm"
          >
            ← Back
          </button>
          <div className="min-w-0">
            <div className="text-sm text-[var(--color-text-muted)]">{project.template}</div>
            <h1 className="text-xl font-semibold truncate">{project.name}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {driveBadge && (
              <span className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                Drive {driveBadge}
              </span>
            )}
            {project.folderLabel && (
              <span className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                {project.folderLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Project Plan & Files Tabs */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('plan')}
                  className={
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                    (activeTab === 'plan'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5')
                  }
                >
                  Project Plan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('files')}
                  className={
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                    (activeTab === 'files'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5')
                  }
                >
                  Files
                </button>
              </div>
              {activeTab === 'files' && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] hover:border-white/20 text-sm"
                >
                  Upload
                </button>
              )}
            </div>

            {activeTab === 'plan' && (
              <div className="p-5">
                <div className="flex gap-4">
                  {project.plan.map((stage, stageIndex) => {
                    const doneCount = stage.tasks.filter((t) => t.done).length;
                    const totalCount = stage.tasks.length;

                    return (
                      <div
                        key={stage.id}
                        className="flex-1 min-w-[220px] rounded-2xl border border-[var(--color-border)] bg-black/10"
                      >
                        <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="shrink-0 text-xs font-bold text-[var(--color-text-muted)]">
                              {String(stageIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-semibold truncate">{stage.title}</span>
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            {doneCount}/{totalCount}
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex flex-col min-h-[200px]">
                          {stage.tasks.length === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const title = prompt('Enter task name:');
                                if (title?.trim()) addTask(stage.id, title.trim());
                              }}
                              className="flex-1 rounded-xl border border-dashed border-[var(--color-border)] bg-black/5 hover:border-white/20 flex items-center justify-center text-sm text-[var(--color-text-muted)] transition-colors"
                            >
                              + Add shooting day
                            </button>
                          ) : (
                            <>
                              {stage.tasks.map((step) => (
                                <div
                                  key={step.id}
                                  className={
                                    'w-full rounded-xl border px-3 py-3 transition-colors ' +
                                    (step.done
                                      ? 'border-emerald-500/30 bg-emerald-500/10'
                                      : 'border-[var(--color-border)] bg-[var(--color-surface)]')
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleTask(stage.id, step.id)}
                                      className={
                                        'h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-xs border transition-colors ' +
                                        (step.done
                                          ? 'border-emerald-500/60 bg-emerald-500/20 text-white'
                                          : 'border-[var(--color-border)] bg-black/10 text-transparent hover:border-white/30')
                                      }
                                      aria-label={step.done ? 'Mark incomplete' : 'Mark complete'}
                                    >
                                      {step.done && '✓'}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div
                                        className={
                                          step.done
                                            ? 'text-sm text-[var(--color-text-secondary)] line-through'
                                            : 'text-sm text-white'
                                        }
                                      >
                                        {step.title}
                                      </div>
                                    </div>

                                    <div
                                      className="h-6 w-6 shrink-0 rounded-full border border-[var(--color-border)] bg-black/10 flex items-center justify-center text-xs text-[var(--color-text-muted)]"
                                      title={step.assignee || 'Unassigned'}
                                    >
                                      {step.assignee ? step.assignee.charAt(0).toUpperCase() : '?'}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 mt-2 pl-8">
                                    <button
                                      type="button"
                                      className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-white transition-colors"
                                      title="Set due date"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {step.dueDate || ''}
                                    </button>
                                    <button
                                      type="button"
                                      className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-white transition-colors"
                                      title="Set assignee"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}

                          {stage.tasks.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const title = prompt('Enter task name:');
                                if (title?.trim()) addTask(stage.id, title.trim());
                              }}
                              className="flex items-center justify-center gap-1 py-2 text-xs text-[var(--color-text-muted)] hover:text-white transition-colors"
                            >
                              <span className="text-base">+</span> Add a step
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="p-5 space-y-6">
                {/* Stage Folders */}
                <div className="grid grid-cols-5 gap-4">
                  {['Development', 'Pre-Production', 'Production', 'Post-Production', 'Delivery'].map((stageName) => (
                    <div
                      key={stageName}
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-black/20 px-4 py-3 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{stageName}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">0 MB</div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 p-1 rounded hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="6" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="18" r="2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Area */}
                <div
                  className="h-24 rounded-xl border border-dashed border-[var(--color-border)] bg-black/10 flex items-center justify-center text-sm text-[var(--color-text-secondary)] hover:border-white/20 transition-colors cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload files or drag & drop
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />

                {/* Uploaded Files */}
                {project.files.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Uploaded Files</div>
                    {project.files.slice(0, 8).map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-black/10 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-sm truncate">{f.name}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{Math.round(f.size / 1024)} KB</div>
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)]">{f.type || 'file'}</div>
                      </div>
                    ))}
                    {project.files.length > 8 && (
                      <div className="text-xs text-[var(--color-text-muted)]">
                        +{project.files.length - 8} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <div className="text-sm font-semibold">Team</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Members with access to this project.</div>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <input
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Member name"
                  className="w-full px-3 py-2 rounded-lg bg-black/10 border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="Role (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-black/10 border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm"
                >
                  Add member
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {project.members.length > 0 ? (
                  project.members.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-[var(--color-border)] bg-black/10 px-3 py-2"
                    >
                      <div className="text-sm">{m.name}</div>
                      {m.role && <div className="text-xs text-[var(--color-text-muted)]">{m.role}</div>}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[var(--color-text-muted)]">No members yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Workstations */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <div className="text-sm font-semibold">Workstations</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Links to connected machines.</div>
            </div>

            <div className="p-5 space-y-3">
              <input
                value={wsLabel}
                onChange={(e) => setWsLabel(e.target.value)}
                placeholder="Label (e.g. Studio iMac)"
                className="w-full px-3 py-2 rounded-lg bg-black/10 border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <input
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="Link (e.g. https://...)"
                className="w-full px-3 py-2 rounded-lg bg-black/10 border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={addWorkstation}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] hover:border-white/20 text-sm"
              >
                Add workstation link
              </button>

              <div className="space-y-2 pt-2">
                {project.workstations.length > 0 ? (
                  project.workstations.map((w) => (
                    <a
                      key={w.id}
                      href={w.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border border-[var(--color-border)] bg-black/10 px-3 py-2 hover:border-white/20"
                    >
                      <div className="text-sm">{w.label}</div>
                      <div className="text-xs text-[var(--color-text-muted)] truncate">{w.url}</div>
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-[var(--color-text-muted)]">No workstations yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
