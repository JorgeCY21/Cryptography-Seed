import { useState } from 'react';
import { BlocksViewer } from './components/SeedVisualizer/BlocksViewer';
import { ExplanationBox } from './components/SeedVisualizer/ExplanationBox';
import { InputPanel } from './components/SeedVisualizer/InputPanel';
import { KeyPreparationCard } from './components/SeedVisualizer/KeyPreparationCard';
import { ModeTabs } from './components/SeedVisualizer/ModeTabs';
import { PaddingCard } from './components/SeedVisualizer/PaddingCard';
import { ResultPanel } from './components/SeedVisualizer/ResultPanel';
import { Stepper } from './components/SeedVisualizer/Stepper';
import { SubkeysTable } from './components/SeedVisualizer/SubkeysTable';
import {
  createDecryptionTrace,
  createEncryptionTrace,
  validateDecryptInput,
  validateEncryptInput,
} from './seedTrace';
import type { SeedDecryptionTrace, SeedEncryptionTrace, SeedMode, SeedStepId } from './seedTraceTypes';

const EXAMPLE_MESSAGE = 'Hola, esto es una prueba del algoritmo SEED!';
const EXAMPLE_KEY = 'MiClaveSecreta16';

export default function SeedVisualizer() {
  const [mode, setMode] = useState<SeedMode>('encrypt');
  const [message, setMessage] = useState(EXAMPLE_MESSAGE);
  const [keyText, setKeyText] = useState(EXAMPLE_KEY);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<SeedStepId>('input');
  const [encryptTrace, setEncryptTrace] = useState<SeedEncryptionTrace | null>(null);
  const [decryptTrace, setDecryptTrace] = useState<SeedDecryptionTrace | null>(null);

  const currentResult = mode === 'encrypt' ? encryptTrace?.finalResultHex ?? '' : decryptTrace?.finalPlaintext ?? '';

  const handleRun = () => {
    const validation =
      mode === 'encrypt'
        ? validateEncryptInput(message, keyText)
        : validateDecryptInput(message, keyText);

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setError(null);

      if (mode === 'encrypt') {
        const trace = createEncryptionTrace(message, keyText);
        setEncryptTrace(trace);
        setDecryptTrace(null);
      } else {
        const trace = createDecryptionTrace(message, keyText);
        setDecryptTrace(trace);
        setEncryptTrace(null);
      }

      setActiveStep('preparation');
    } catch (traceError) {
      setError(
        traceError instanceof Error
          ? traceError.message
          : 'No se pudo completar el proceso solicitado.',
      );
    }
  };

  const handleClear = () => {
    setMessage('');
    setKeyText('');
    setError(null);
    setEncryptTrace(null);
    setDecryptTrace(null);
    setActiveStep('input');
  };

  const handleExample = () => {
    if (mode === 'encrypt') {
      setMessage(EXAMPLE_MESSAGE);
    } else {
      try {
        const trace = createEncryptionTrace(EXAMPLE_MESSAGE, EXAMPLE_KEY);
        setMessage(trace.finalResultHex);
      } catch {
        setMessage('');
      }
    }

    setKeyText(EXAMPLE_KEY);
    setError(null);
  };

  const handleCopy = async () => {
    if (!currentResult) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentResult);
    } catch {
      setError('No se pudo copiar el resultado al portapapeles.');
    }
  };

  const handleStepClick = (step: SeedStepId) => {
    setActiveStep(step);
    document.getElementById(step)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const traceSections = mode === 'encrypt' ? renderEncryptTrace(encryptTrace) : renderDecryptTrace(decryptTrace);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Exposicion academica</span>
          <h1>Visualizador del algoritmo SEED</h1>
          <p>
            Recorre el cifrado y el descifrado bloque por bloque, ronda por ronda, con una vista pensada para
            explicar el funcionamiento interno de una red Feistel sin alterar la implementacion original.
          </p>
        </div>
        <ModeTabs mode={mode} onChange={setMode} />
      </section>

      <Stepper activeStep={activeStep} onStepClick={handleStepClick} />

      <div id="input">
        <InputPanel
          mode={mode}
          message={message}
          keyText={keyText}
          error={error}
          onMessageChange={setMessage}
          onKeyChange={setKeyText}
          onRun={handleRun}
          onClear={handleClear}
          onExample={handleExample}
        />
      </div>

      {traceSections}

      <div id="result">
        <ResultPanel
          title={mode === 'encrypt' ? 'Mensaje cifrado final en hexadecimal' : 'Mensaje original recuperado'}
          value={currentResult}
          onCopy={handleCopy}
        />
      </div>
    </main>
  );
}

function renderEncryptTrace(trace: SeedEncryptionTrace | null) {
  if (!trace) {
    return null;
  }

  return (
    <>
      <section className="grid-two" id="preparation">
        <div className="card">
          <div className="section-heading">
            <span className="section-kicker">Entrada</span>
            <h2>Resumen del mensaje</h2>
          </div>
          <div className="kv-grid">
            <div>
              <span className="kv-label">Mensaje original</span>
              <code>{trace.input.originalMessage}</code>
            </div>
            <div>
              <span className="kv-label">Clave original</span>
              <code>{trace.input.originalKey}</code>
            </div>
            <div>
              <span className="kv-label">Mensaje en bytes</span>
              <code>{trace.padding.messageBytesHex}</code>
            </div>
          </div>
        </div>
        <ExplanationBox title="Idea academica">
          El padding completa el mensaje para que tenga tamano multiplo de 16 bytes, permitiendo procesarlo bloque a
          bloque con la estructura del algoritmo.
        </ExplanationBox>
      </section>

      <div>
        <KeyPreparationCard
          originalKey={trace.keyPreparation.originalKey}
          preparedKeyHex={trace.keyPreparation.preparedKeyHex}
          preparedKeyTextPreview={trace.keyPreparation.preparedKeyTextPreview}
        />
      </div>

      <div id="padding">
        <PaddingCard
          sourceLabel="Mensaje convertido a bytes y alineado"
          sourceHex={trace.padding.messageBytesHex}
          paddedHex={trace.padding.paddedHex}
          paddingLength={trace.padding.paddingLength}
        />
      </div>

      <section className="grid-two" id="subkeys">
        <SubkeysTable
          title="Subclaves K0 a K15"
          subtitle="Las subclaves se generan a partir de la clave principal y se aplican secuencialmente durante el cifrado."
          subkeys={trace.subkeys}
        />
        <ExplanationBox title="Red Feistel">
          En una red Feistel, el bloque se divide en dos mitades L y R. En cada ronda, la mitad derecha alimenta la
          funcion F y su resultado transforma a la mitad izquierda.
        </ExplanationBox>
      </section>

      <div id="blocks">
        <div id="rounds">
          <BlocksViewer
            title="Proceso por bloque"
            subtitle="Cada bloque de 16 bytes puede expandirse para revisar todas las rondas, sus valores L y R y el resultado de la funcion F."
            blocks={trace.blocks}
          />
        </div>
      </div>
    </>
  );
}

function renderDecryptTrace(trace: SeedDecryptionTrace | null) {
  if (!trace) {
    return null;
  }

  return (
    <>
      <section className="grid-two" id="preparation">
        <div className="card">
          <div className="section-heading">
            <span className="section-kicker">Entrada</span>
            <h2>Resumen del cifrado recibido</h2>
          </div>
          <div className="kv-grid">
            <div>
              <span className="kv-label">Texto cifrado recibido</span>
              <code>{trace.input.originalCipherHex}</code>
            </div>
            <div>
              <span className="kv-label">Bytes del cifrado</span>
              <code>{trace.cipherInput.cipherBytesHex}</code>
            </div>
            <div>
              <span className="kv-label">Clave original</span>
              <code>{trace.input.originalKey}</code>
            </div>
          </div>
        </div>
        <ExplanationBox title="Idea academica">
          Para descifrar, se aplica el mismo proceso usando las subclaves en orden inverso. Esa simetria es una
          caracteristica clave de la red Feistel.
        </ExplanationBox>
      </section>

      <div>
        <KeyPreparationCard
          originalKey={trace.keyPreparation.originalKey}
          preparedKeyHex={trace.keyPreparation.preparedKeyHex}
          preparedKeyTextPreview={trace.keyPreparation.preparedKeyTextPreview}
        />
      </div>

      <section className="grid-two" id="subkeys">
        <SubkeysTable
          title="Subclaves generadas"
          subtitle="Estas son las subclaves obtenidas a partir de la clave principal antes de invertir su orden."
          subkeys={trace.subkeys}
        />
        <SubkeysTable
          title="Subclaves invertidas"
          subtitle="El descifrado reutiliza el algoritmo, pero recorre las subclaves desde K15 hasta K0."
          subkeys={trace.reversedSubkeys}
        />
      </section>

      <div id="padding">
        <PaddingCard
          sourceLabel="Bloque descifrado y eliminacion del padding"
          sourceHex={trace.paddingRemoved.paddedPlaintextHex}
          paddedHex={trace.paddingRemoved.unpaddedPlaintextHex}
          paddingLength={trace.paddingRemoved.paddingLength}
        />
      </div>

      <div id="blocks">
        <div id="rounds">
          <BlocksViewer
            title="Proceso inverso por bloque"
            subtitle="Expande cada bloque para observar las rondas inversas, los valores L y R y la transformacion que permite recuperar el mensaje original."
            blocks={trace.blocks}
          />
        </div>
      </div>
    </>
  );
}
