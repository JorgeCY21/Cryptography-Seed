interface KeyPreparationCardProps {
  originalKey: string;
  preparedKeyHex: string;
  preparedKeyTextPreview: string;
}

export function KeyPreparationCard({
  originalKey,
  preparedKeyHex,
  preparedKeyTextPreview,
}: KeyPreparationCardProps) {
  return (
    <section className="card accent-key">
      <div className="section-heading">
        <span className="section-kicker">Preparación</span>
        <h2>Clave preparada a 16 bytes</h2>
      </div>
      <div className="kv-grid">
        <div>
          <span className="kv-label">Clave original</span>
          <code>{originalKey}</code>
        </div>
        <div>
          <span className="kv-label">Clave preparada en hexadecimal</span>
          <code>{preparedKeyHex}</code>
        </div>
        <div>
          <span className="kv-label">Vista textual</span>
          <code>{preparedKeyTextPreview}</code>
        </div>
      </div>
    </section>
  );
}
