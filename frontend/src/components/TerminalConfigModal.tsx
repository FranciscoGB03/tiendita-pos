import { useState } from "react";

interface TerminalConfigModalProps {
  onConfigure: (id: string) => void;
}

export function TerminalConfigModal({ onConfigure }: TerminalConfigModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onConfigure(inputValue.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-neutral/20">
        <h2 className="text-2xl font-bold text-text mb-4 text-center">
          Configurar esta caja
        </h2>
        <p className="text-neutral mb-6 text-center">
          Esta es la primera vez que usas este dispositivo. ¿Qué número de caja
          es?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ej: caja-01"
            className="w-full p-4 text-xl border-2 border-neutral/30 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text bg-background"
            required
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onConfigure("caja-01")}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Caja 1
            </button>
            <button
              type="button"
              onClick={() => onConfigure("caja-02")}
              className="flex-1 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
            >
              Caja 2
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-success text-white rounded-lg font-bold text-lg hover:bg-success/90 transition-colors"
          >
            GUARDAR
          </button>
        </form>
      </div>
    </div>
  );
}
