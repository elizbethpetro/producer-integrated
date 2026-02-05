import type { TemplateType } from '../../types';
import { templates } from '../../data/templates';
import { TemplateCard } from './TemplateCard';

interface TemplateSelectionProps {
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (id: TemplateType) => void;
  onContinue: () => void;
}

export function TemplateSelection({ selectedTemplate, onSelectTemplate, onContinue }: TemplateSelectionProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Create New Project</h1>
        <p className="text-[var(--color-text-secondary)]">
          Select a template that best fits your production type
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          disabled={!selectedTemplate}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-200
            ${selectedTemplate
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
