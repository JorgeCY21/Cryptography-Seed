import type { SeedMode } from '../../seedTraceTypes';

interface ModeTabsProps {
  mode: SeedMode;
  onChange: (mode: SeedMode) => void;
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Modo del visualizador">
      <button
        type="button"
        className={mode === 'encrypt' ? 'mode-tab active' : 'mode-tab'}
        onClick={() => onChange('encrypt')}
      >
        Encriptar
      </button>
      <button
        type="button"
        className={mode === 'decrypt' ? 'mode-tab active' : 'mode-tab'}
        onClick={() => onChange('decrypt')}
      >
        Desencriptar
      </button>
    </div>
  );
}
