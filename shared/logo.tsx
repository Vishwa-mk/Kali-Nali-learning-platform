import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <BrainCircuit className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl font-bold text-primary">
        <h1>Kali Nali</h1>
      </span>
    </Link>
  );
}
