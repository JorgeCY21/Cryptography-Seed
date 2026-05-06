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
          <span className="kv-label">F(R, Ki)</span>
          <code>{round.fResultHex}</code>
        </div>
        <div>
          <span className="kv-label">L después</span>
          <code>{round.LAfterHex}</code>
        </div>
        <div>
          <span className="kv-label">R después</span>
          <code>{round.RAfterHex}</code>
        </div>
      </div>
    </article>
  );
}
