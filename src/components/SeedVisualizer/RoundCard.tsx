import type { SeedRoundTrace } from '../../seedTraceTypes';

interface RoundCardProps {
  round: SeedRoundTrace;
}

export function RoundCard({ round }: RoundCardProps) {
  return (
    <article className="round-card">
      <div className="round-header">
        <strong>Ronda {round.round}</strong>
        <code>{round.subkeyHex}</code>
      </div>
      <div className="round-grid">
        <div>
          <span className="kv-label">L antes</span>
          <code>{round.LBeforeHex}</code>
        </div>
        <div>
          <span className="kv-label">R antes</span>
          <code>{round.RBeforeHex}</code>
        </div>
        <div>
          <span className="kv-label">Ki [K0, K1]</span>
          <code>{round.subkeyWordsHex[0]} | {round.subkeyWordsHex[1]}</code>
        </div>
        <div>
          <span className="kv-label">F(R, Ki)</span>
          <code>{round.fResultHex}</code>
        </div>
        <div>
          <span className="kv-label">F(R, Ki) [T0, T1]</span>
          <code>{round.fResultWordsHex[0]} | {round.fResultWordsHex[1]}</code>
        </div>
        <div>
          <span className="kv-label">L despues</span>
          <code>{round.LAfterHex}</code>
        </div>
        <div>
          <span className="kv-label">R despues</span>
          <code>{round.RAfterHex}</code>
        </div>
      </div>
    </article>
  );
}
