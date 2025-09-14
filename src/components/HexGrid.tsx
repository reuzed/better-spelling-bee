import { HexButton } from "./HexButton";

interface HexGridProps {
  letters: string[]; // length 7
  center: string; // one of letters
  onPick: (letter: string) => void;
}

// Layout: center in middle, others around in hexagon order
export function HexGrid({ letters, center, onPick }: HexGridProps) {
  const others = letters.filter((l) => l !== center);
  return (
    <div className="grid gap-4 place-items-center">
      {/* Row 1: 2 letters */}
      <div className="grid grid-cols-2 gap-4">
        <HexButton letter={others[0]} onClick={onPick} />
        <HexButton letter={others[1]} onClick={onPick} />
      </div>

      {/* Row 2: 3 letters (with center in middle row) */}
      <div className="grid grid-cols-3 gap-4">
        <HexButton letter={others[2]} onClick={onPick} />
        <HexButton letter={center} isCenter onClick={onPick} />
        <HexButton letter={others[3]} onClick={onPick} />
      </div>

      {/* Row 3: 2 letters */}
      <div className="grid grid-cols-2 gap-4">
        <HexButton letter={others[4]} onClick={onPick} />
        <HexButton letter={others[5]} onClick={onPick} />
      </div>
    </div>
  );
}
