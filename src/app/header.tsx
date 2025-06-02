'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-4xl mx-auto flex gap-6 relative">
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>

        <div className="relative group">
          {/* Group-hover must apply to a shared hoverable box */}
          <div className="cursor-pointer">Visualisations ▾</div>

          {/* Wrapper that remains hoverable */}
          <div className="absolute left-0 top-full w-max group-hover:block hidden">
            <div className="bg-white text-black shadow-md rounded min-w-[12rem] z-10">
              <Link
                href="/wordtree"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Word Tree
              </Link>
              <Link
                href="/network"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Network
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
