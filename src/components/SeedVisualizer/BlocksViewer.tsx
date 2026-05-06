import type { SeedBlockTrace } from '../../seedTraceTypes';
import { RoundCard } from './RoundCard';

interface BlocksViewerProps {
  title: string;
  subtitle: string;
  blocks: SeedBlockTrace[];
}

export function BlocksViewer({ title, subtitle, blocks }: BlocksViewerProps) {
  return (
    <section className="card accent-blocks">
      <div className="section-heading">
        <span className="section-kicker">Bloques</span>
        <h2>{title}</h2>
      </div>
      <p className="section-copy">{subtitle}</p>

      <div className="blocks-stack">
        {blocks.map((block) => (
          <details key={`${block.index}-${block.outputBlockHex}`} className="block-details">
            <summary>
              <div>
                <strong>Bloque {block.index}</strong>
                <span>Entrada: {block.inputBlockHex}</span>
              </div>
              <code>{block.outputBlockHex}</code>
            </summary>

            <div className="block-meta">
              <div>
                <span className="kv-label">Bloque de entrada</span>
                <code>{block.inputBlockHex}</code>
              </div>
              <div>
                <span className="kv-label">Bloque de salida</span>
                <code>{block.outputBlockHex}</code>
              </div>
            </div>

            <div className="rounds-list">
              {block.rounds.map((round) => (
                <RoundCard key={`${block.index}-${round.round}`} round={round} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
