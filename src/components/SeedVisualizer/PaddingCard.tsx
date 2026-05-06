interface PaddingCardProps {
  sourceLabel: string;
  sourceHex: string;
  paddedHex: string;
  paddingLength: number;
}

export function PaddingCard({
  sourceLabel,
  sourceHex,
  paddedHex,
  paddingLength,
}: PaddingCardProps) {
  return (
    <section className="card accent-padding">
      <div className="section-heading">
        <span className="section-kicker">Padding</span>
        <h2>{sourceLabel}</h2>
      </div>
      <div className="kv-grid">
        <div>
          <span className="kv-label">Bytes originales</span>
          <code>{sourceHex || 'vacío'}</code>
        </div>
        <div>
          <span className="kv-label">Resultado alineado a 16 bytes</span>
          <code>{paddedHex || 'vacío'}</code>
        </div>
        <div>
          <span className="kv-label">Bytes agregados o retirados</span>
          <strong>{paddingLength}</strong>
        </div>
      </div>
    </section>
  );
}
