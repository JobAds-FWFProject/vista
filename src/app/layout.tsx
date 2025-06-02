import type { Metadata } from "next";
import Header from './header'; // adjust path if needed

import "./globals.css";

export const metadata: Metadata = {
    title: "Jobads",
    description: "The making of the incredibly differentiated labor market"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <html lang="en">
            <body className="flex min-h-screen flex-col">
                <Header />

                <main className="flex-1 max-w-4xl mx-auto p-4">{children}</main>

                <footer className="w-full text-center text-sm py-4 mt-auto">
                    © {new Date().getFullYear()} Jobads: The making of the incredibly differentiated
                    labor market (FWF P35783)
                </footer>
            </body>
        </html >
    );
}

