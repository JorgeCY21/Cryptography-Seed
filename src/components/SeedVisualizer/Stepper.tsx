import type { SeedStepId } from '../../seedTraceTypes';

interface StepperProps {
  activeStep: SeedStepId;
  onStepClick: (step: SeedStepId) => void;
}

const steps: Array<{ id: SeedStepId; label: string }> = [
  { id: 'input', label: 'Entrada' },
  { id: 'preparation', label: 'Preparación' },
  { id: 'padding', label: 'Padding' },
  { id: 'subkeys', label: 'Subclaves' },
  { id: 'blocks', label: 'Bloques' },
  { id: 'rounds', label: 'Rondas' },
  { id: 'result', label: 'Resultado' },
];

export function Stepper({ activeStep, onStepClick }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Etapas del proceso SEED">
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={step.id === activeStep ? 'step-item active' : 'step-item'}
          onClick={() => onStepClick(step.id)}
        >
          <span className="step-index">{index + 1}</span>
          <span>{step.label}</span>
        </button>
      ))}
    </nav>
  );
}
