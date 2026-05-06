interface ResultPanelProps {
  title: string;
  value: string;
  onCopy: () => void;
}

export function ResultPanel({ title, value, onCopy }: ResultPanelProps) {
  return (
    <section className="card accent-result">
      <div className="section-heading">
        <span className="section-kicker">Resultado</span>
        <h2>{title}</h2>
      </div>
      <div className="result-shell">
        <div className="result-box">
          <span className="kv-label">Valor final</span>
          <code>{value || 'Sin resultado todavia'}</code>
        </div>
      </div>
      <div className="result-actions">
        <button type="button" className="secondary-button" onClick={onCopy} disabled={!value}>
          Copiar resultado
        </button>
      </div>
    </section>
  );
}
