'use client';
import './header.css';
import Link from 'next/link';

export default function Header() {
  return (
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/explore">Explore</Link>
                <Link
                    href="/wordtree"
                >
                    Word Tree
                </Link>
                <Link
                    href="/network"
                >
                    Network
                </Link>

            </nav>
        </header>
    );
}
