import type { Template, TemplateType } from '../../types';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (id: TemplateType) => void;
}

const colorMap: Record<TemplateType, string> = {
  blank: 'border-zinc-500 bg-zinc-500/10',
  filmmaker: 'border-amber-500 bg-amber-500/10',
  vfx: 'border-violet-500 bg-violet-500/10',
  gaming: 'border-emerald-500 bg-emerald-500/10',
  'live-sports': 'border-red-500 bg-red-500/10',
};

const hoverColorMap: Record<TemplateType, string> = {
  blank: 'hover:border-zinc-400',
  filmmaker: 'hover:border-amber-400',
  vfx: 'hover:border-violet-400',
  gaming: 'hover:border-emerald-400',
  'live-sports': 'hover:border-red-400',
};

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const baseClasses = 'relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200';
  const selectedClasses = isSelected
    ? colorMap[template.id]
    : 'border-[var(--color-border)] bg-[var(--color-surface)] ' + hoverColorMap[template.id];

  return (
    <div
      className={`${baseClasses} ${selectedClasses}`}
      onClick={() => onSelect(template.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(template.id)}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <svg className="w-4 h-4 text-[var(--color-background)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className="text-4xl mb-4">{template.icon}</div>

      <h3 className="text-xl font-semibold mb-2">{template.name}</h3>

      <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed">
        {template.description}
      </p>

      <ul className="space-y-1">
        {template.features.map((feature) => (
          <li key={feature} className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
