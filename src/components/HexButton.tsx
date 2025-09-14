// no React import needed with React 17+ JSX transform

interface HexButtonProps {
  letter: string;
  isCenter?: boolean;
  onClick?: (letter: string) => void;
}

export function HexButton({
  letter,
  isCenter = false,
  onClick,
}: HexButtonProps) {
  return (
    <button
      onClick={() => onClick?.(letter)}
      className={
        "w-32 h-28 md:w-36 md:h-32 relative text-5xl md:text-6xl font-extrabold uppercase " +
        "transition active:scale-95 select-none " +
        'before:content-[""] before:absolute before:inset-0 before:clip-path-[polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)] ' +
        (isCenter
          ? "text-neutral-900 before:bg-amber-300 hover:before:bg-amber-400 shadow-lg"
          : "text-neutral-900 before:bg-neutral-200 hover:before:bg-neutral-300 shadow")
      }
    >
      <span className="absolute inset-0 grid place-items-center leading-none">
        {letter}
      </span>
    </button>
  );
}
