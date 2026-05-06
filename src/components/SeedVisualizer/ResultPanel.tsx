interface ResultPanelProps {
  title: string;
  value: string;
  secondaryTitle?: string;
  secondaryValue?: string;
  onCopy: () => void;
}

export function ResultPanel({
  title,
  value,
  secondaryTitle,
  secondaryValue,
  onCopy,
}: ResultPanelProps) {
  return (
    <section className="card accent-result">
      <div className="section-heading">
        <span className="section-kicker">Resultado</span>
        <h2>Salidas finales</h2>
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span className="kv-label">{title}</span>
          <code>{value || 'Sin resultado todavia'}</code>
        </div>
        {secondaryTitle && secondaryValue ? (
          <div className="result-box">
            <span className="kv-label">{secondaryTitle}</span>
            <code>{secondaryValue}</code>
          </div>
        ) : null}
      </div>
      <div className="result-actions">
        <button type="button" className="secondary-button" onClick={onCopy} disabled={!value}>
          Copiar resultado
        </button>
      </div>
    </section>
  );
}
