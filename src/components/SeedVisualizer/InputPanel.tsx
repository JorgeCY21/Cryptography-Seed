import type { SeedMode } from '../../seedTraceTypes';

interface InputPanelProps {
  mode: SeedMode;
  message: string;
  keyText: string;
  error: string | null;
  onMessageChange: (value: string) => void;
  onKeyChange: (value: string) => void;
  onRun: () => void;
  onClear: () => void;
  onExample: () => void;
}

export function InputPanel({
  mode,
  message,
  keyText,
  error,
  onMessageChange,
  onKeyChange,
  onRun,
  onClear,
  onExample,
}: InputPanelProps) {
  const isEncrypt = mode === 'encrypt';

  return (
    <section className="card">
      <div className="section-heading">
        <span className="section-kicker">Entrada</span>
        <h2>Datos de trabajo</h2>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>{isEncrypt ? 'Mensaje en texto plano' : 'Texto cifrado en hexadecimal'}</span>
          <textarea
            rows={4}
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder={
              isEncrypt
                ? 'Escribe el mensaje que será procesado por SEED'
                : 'Pega aquí el texto cifrado en hexadecimal'
            }
          />
        </label>

        <label className="field">
          <span>Clave secreta</span>
          <input
            type="text"
            value={keyText}
            onChange={(event) => onKeyChange(event.target.value)}
            placeholder="Ingresa la clave"
          />
        </label>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="actions-row">
        <button type="button" className="primary-button" onClick={onRun}>
          {isEncrypt ? 'Encriptar' : 'Desencriptar'}
        </button>
        <button type="button" className="secondary-button" onClick={onClear}>
          Limpiar
        </button>
        <button type="button" className="secondary-button" onClick={onExample}>
          Cargar ejemplo
        </button>
      </div>
    </section>
  );
}
