import type { SeedSubkeyTrace } from '../../seedTraceTypes';

interface SubkeysTableProps {
  title: string;
  subtitle: string;
  subkeys: SeedSubkeyTrace[];
}

export function SubkeysTable({ title, subtitle, subkeys }: SubkeysTableProps) {
  return (
    <section className="card accent-subkeys">
      <div className="section-heading">
        <span className="section-kicker">Subclaves</span>
        <h2>{title}</h2>
      </div>
      <p className="section-copy">{subtitle}</p>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Etiqueta</th>
              <th>Indice</th>
              <th>K0</th>
              <th>K1</th>
              <th>Subclave completa</th>
            </tr>
          </thead>
          <tbody>
            {subkeys.map((subkey) => (
              <tr key={`${subkey.label}-${subkey.hex}`}>
                <td>{subkey.label}</td>
                <td>{subkey.index}</td>
                <td>
                  <code>{subkey.k0Hex}</code>
                </td>
                <td>
                  <code>{subkey.k1Hex}</code>
                </td>
                <td>
                  <code>{subkey.hex}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
