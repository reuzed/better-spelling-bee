import { useRef } from "react";

interface ControlsProps {
  onShuffle: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function Controls({
  onShuffle,
  onBackspace,
  onSubmit,
  onClear,
}: ControlsProps) {
  const submitRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex gap-2 justify-center">
      <button
        className="px-3 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
        onClick={onShuffle}
      >
        Shuffle
      </button>
      <button
        className="px-3 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
        onClick={onBackspace}
      >
        Backspace
      </button>
      <button
        ref={submitRef}
        className="px-3 py-2 rounded bg-amber-300 hover:bg-amber-400 text-neutral-900 font-semibold"
        onClick={onSubmit}
      >
        Enter
      </button>
      <button
        className="px-3 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  );
}
