import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { templates } from '../../data/templates';
import type { TemplateType } from '../../types';

export interface NewProjectPayload {
  template: TemplateType;
  name: string;
  folderLabel: string;
  driveLetter: string;
  coverFile: File | null;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: NewProjectPayload) => void;
}

const DRIVE_LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export function NewProjectModal({ isOpen, onClose, onCreate }: NewProjectModalProps) {
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [name, setName] = useState('');
  const [folderLabel, setFolderLabel] = useState('');
  const [driveLetter, setDriveLetter] = useState('F');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return Boolean(template) && name.trim().length > 0;
  }, [template, name]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!template || name.trim().length === 0) return;
    onCreate({
      template,
      name: name.trim(),
      folderLabel: folderLabel.trim(),
      driveLetter,
      coverFile,
    });

    // reset for next time
    setTemplate(null);
    setName('');
    setFolderLabel('');
    setDriveLetter('F');
    setCoverFile(null);
    onClose();
  };

  const handlePickCover = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        type="button"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute left-1/2 top-1/2 w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 id={titleId} className="text-sm font-semibold tracking-wide text-white">
            New Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-white/5 text-[var(--color-text-secondary)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                Project template
              </h3>
              {template && (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Selected: {template}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((t) => {
                const selected = template === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={
                      'text-left rounded-xl border px-4 py-3 transition-colors ' +
                      (selected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-white/20')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{t.icon}</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{t.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          {/* Project Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Project settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs text-[var(--color-text-secondary)]">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Documentary"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-[var(--color-text-secondary)]">Cover</label>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    {coverPreviewUrl ? (
                      <div className="space-y-3">
                        <img
                          src={coverPreviewUrl}
                          alt="Cover preview"
                          className="w-full h-36 object-cover rounded-lg border border-[var(--color-border)]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handlePickCover}
                            className="px-3 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-white/5"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverFile(null)}
                            className="px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-white/5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePickCover}
                        className="w-full h-36 rounded-lg border border-dashed border-[var(--color-border)] hover:border-white/20 flex items-center justify-center text-sm text-[var(--color-text-secondary)]"
                      >
                        Upload a cover
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs text-[var(--color-text-secondary)]">Folder label</label>
                  <div className="relative">
                    <input
                      value={folderLabel}
                      onChange={(e) => setFolderLabel(e.target.value)}
                      placeholder="Folder label"
                      className="w-full pr-10 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    {folderLabel.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFolderLabel('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-white/5 text-[var(--color-text-secondary)]"
                        aria-label="Clear folder label"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-[var(--color-text-secondary)]">Drive letter</label>
                  <div className="grid grid-cols-8 gap-2">
                    {DRIVE_LETTERS.map((l) => {
                      const selected = driveLetter === l;
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setDriveLetter(l)}
                          className={
                            'h-9 rounded-lg text-sm border transition-colors ' +
                            (selected
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white'
                              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-white/20')
                          }
                        >
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Tip</div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Choose a template + name to enable “Add Project”.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!isValid}
            className={
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
              (isValid
                ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed')
            }
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
