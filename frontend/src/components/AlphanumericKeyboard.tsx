import { useState } from "react";

interface AlphanumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onSpace: () => void;
  onEnter?: () => void;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
];

export function AlphanumericKeyboard({
  onKeyPress,
  onDelete,
  onSpace,
  onEnter,
}: AlphanumericKeyboardProps) {
  const [isUppercase, setIsUppercase] = useState(false);

  const handleKeyClick = (key: string) => {
    const finalKey = isUppercase ? key.toUpperCase() : key.toLowerCase();
    onKeyPress(finalKey);
    if (isUppercase) setIsUppercase(false);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-primary/20 p-6 space-y-3">
      {/* Indicador de campo activo */}
      <div className="text-center pb-3 border-b-2 border-neutral/10">
        <p className="text-text font-semibold text-lg">Teclado Virtual</p>
      </div>

      {/* Filas de letras y números */}
      <div className="space-y-2">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyClick(key)}
                className="flex-1 min-w-[48px] h-[64px] bg-background border-2 border-neutral/20 rounded-xl text-2xl font-bold text-text shadow-sm hover:border-primary hover:bg-primary/10 active:scale-95 active:bg-primary/20 active:border-primary transition-all"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Fila de controles */}
      <div className="flex gap-3 pt-3 border-t-2 border-neutral/10 mt-4">
        <button
          type="button"
          onClick={() => setIsUppercase(!isUppercase)}
          className={`min-w-[100px] h-[64px] rounded-xl text-base font-bold shadow-sm transition-all ${
            isUppercase
              ? "bg-primary text-white border-2 border-primary shadow-lg"
              : "bg-background border-2 border-neutral/20 text-text hover:border-primary hover:bg-primary/10"
          }`}
        >
          MAYÚS
        </button>

        <button
          type="button"
          onClick={onSpace}
          className="flex-1 h-[64px] bg-background border-2 border-neutral/20 rounded-xl text-xl font-bold text-text shadow-sm hover:border-primary hover:bg-primary/10 active:scale-95 active:bg-primary/20 transition-all"
        >
          ESPACIO
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="min-w-[80px] h-[64px] bg-error/10 border-2 border-error/30 rounded-xl text-error font-bold shadow-sm hover:bg-error/20 hover:border-error active:scale-95 transition-all flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
            />
          </svg>
        </button>

        {onEnter && (
          <button
            type="button"
            onClick={onEnter}
            className="min-w-[100px] h-[64px] bg-success text-white border-2 border-success rounded-xl text-base font-bold shadow-lg hover:bg-success/90 active:scale-95 transition-all"
          >
            ENTER
          </button>
        )}
      </div>
    </div>
  );
}
