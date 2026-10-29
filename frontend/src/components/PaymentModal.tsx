import { useState, useEffect, useCallback, useRef } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onSelectMethod: (method: "EFECTIVO" | "TARJETA") => void;
}

type Step = "method" | "amount";
type Method = "EFECTIVO" | "TARJETA" | null;

export const PaymentModal = ({
  isOpen,
  total,
  onClose,
  onSelectMethod,
}: PaymentModalProps) => {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method>(null);
  const [receivedStr, setReceivedStr] = useState("");

  // Cálculos derivados (declarados ANTES de los useEffects que los usan)
  const received = parseFloat(receivedStr) || 0;
  const change = received - total;
  const canConfirm = received >= total;

  // Refs para valores que cambian frecuentemente
  const stepRef = useRef(step);
  const receivedStrRef = useRef(receivedStr);
  const canConfirmRef = useRef(canConfirm);
  const methodRef = useRef(method);

  // Actualizar refs cuando cambien los estados
  useEffect(() => {
    stepRef.current = step;
    receivedStrRef.current = receivedStr;
    canConfirmRef.current = canConfirm;
    methodRef.current = method;
  }, [step, receivedStr, canConfirm, method]);

  // Handler de teclado estabilizado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const currentStep = stepRef.current;
      const currentReceivedStr = receivedStrRef.current;
      const currentCanConfirm = canConfirmRef.current;
      const currentMethod = methodRef.current;

      if (currentStep === "method") {
        if (e.key === "Escape") {
          onClose();
        }
      } else if (currentStep === "amount") {
        if (e.key >= "0" && e.key <= "9") {
          if (currentReceivedStr.length < 10) {
            setReceivedStr((prev) => prev + e.key);
          }
        } else if (e.key === "Backspace") {
          setReceivedStr((prev) => prev.slice(0, -1));
        } else if (e.key === "Enter" && currentCanConfirm && currentMethod) {
          onSelectMethod(currentMethod);
        } else if (e.key === "Escape") {
          setStep("method");
          setMethod(null);
          setReceivedStr("");
        }
      }
    },
    [onClose, onSelectMethod],
  );

  // Listener de teclado (solo se registra cuando isOpen es true)
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleSelectMethod = (m: "EFECTIVO" | "TARJETA") => {
    setMethod(m);
    setStep("amount");
    setReceivedStr("");
  };

  const handleBack = () => {
    setStep("method");
    setMethod(null);
    setReceivedStr("");
  };

  const handleNumber = (num: string) => {
    if (receivedStr.length < 10) {
      setReceivedStr((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setReceivedStr((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (method && canConfirm) {
      onSelectMethod(method);
    }
  };

  // Si el modal está cerrado, no renderizar nada
  if (!isOpen) return null;

  // VISTA 1: Selección de Método
  if (step === "method") {
    return (
      <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-md">
        <div className="mb-8 text-center">
          <p className="text-[24px] text-gray-300 font-medium mb-2">
            Total a cobrar
          </p>
          <p className="text-[64px] font-bold text-white tracking-tight">
            ${total.toFixed(2)}
          </p>
        </div>

        <h3 className="text-[32px] font-bold text-center text-white mb-10">
          ¿Cómo te van a pagar?
        </h3>

        <div className="w-full max-w-2xl grid grid-cols-1 gap-6">
          <button
            onClick={() => handleSelectMethod("EFECTIVO")}
            className="w-full min-h-[120px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-[32px] rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center border-b-4 border-blue-800"
          >
            EFECTIVO
          </button>
          <button
            onClick={() => handleSelectMethod("TARJETA")}
            className="w-full min-h-[120px] bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-[32px] rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center border-b-4 border-purple-800"
          >
            💳 TARJETA
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-10 min-h-[60px] px-12 bg-transparent hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white font-bold text-[20px] rounded-xl transition-colors"
        >
          Cancelar (Esc)
        </button>
      </div>
    );
  }

  // VISTA 2: Ingreso de Monto (Teclado)
  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col p-6 backdrop-blur-md">
      {/* Header con botón Atrás */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="min-h-[60px] px-6 flex items-center text-white text-[24px] font-bold bg-slate-800 hover:bg-slate-700 rounded-xl border-b-4 border-slate-950 transition-all"
        >
          ← Atrás (Esc)
        </button>
        <h3 className="text-[28px] font-bold text-white">
          {method === "EFECTIVO"
            ? "💵 Pago en Efectivo"
            : "💳 Pago con Tarjeta"}
        </h3>
        <div className="w-32"></div>
      </div>

      {/* Displays de Montos */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-6">
        <div className="text-center">
          <p className="text-gray-400 text-[22px] font-medium">
            Total a cobrar
          </p>
          <p className="text-white text-[56px] font-bold">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-[22px] font-medium">Recibido</p>
          <p className="text-white text-[64px] font-bold">
            ${received.toFixed(2)}
          </p>
        </div>

        {method === "EFECTIVO" && (
          <div className="text-center">
            <p className="text-gray-400 text-[22px] font-medium">Cambio</p>
            <p
              className={`text-[64px] font-bold ${change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              ${change >= 0 ? change.toFixed(2) : "0.00"}
            </p>
          </div>
        )}
      </div>

      {/* Teclado Numérico */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto w-full mb-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"].map(
          (key) => (
            <button
              key={key}
              onClick={() =>
                key === "⌫" ? handleBackspace() : handleNumber(key)
              }
              className="h-[80px] bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-[32px] font-bold rounded-xl border-b-4 border-slate-950 transition-all active:translate-y-1 active:border-b-0"
            >
              {key}
            </button>
          ),
        )}
      </div>

      {/* Botón Confirmar */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="w-full max-w-lg mx-auto h-[80px] bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-[32px] font-bold rounded-xl border-b-4 border-green-800 disabled:border-gray-800 transition-all active:translate-y-1 active:border-b-0 disabled:active:translate-y-0"
      >
        COBRAR (Enter)
      </button>
    </div>
  );
};
