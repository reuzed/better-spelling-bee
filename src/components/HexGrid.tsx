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
    <div className="grid grid-cols-3 gap-3 place-items-center">
      <div className="col-span-3 grid grid-cols-3 gap-3 place-items-center">
        <HexButton letter={others[0]} onClick={onPick} />
        <HexButton letter={others[1]} onClick={onPick} />
        <HexButton letter={others[2]} onClick={onPick} />
      </div>
      <HexButton letter={others[3]} onClick={onPick} />
      <HexButton letter={center} isCenter onClick={onPick} />
      <HexButton letter={others[4]} onClick={onPick} />
      <div className="col-span-3 grid grid-cols-3 gap-3 place-items-center">
        <HexButton letter={others[5]} onClick={onPick} />
        <div />
        <div />
      </div>
    </div>
  );
}
