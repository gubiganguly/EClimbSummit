import type { Metadata } from "next";
import { League_Spartan, Pinyon_Script, Inter } from 'next/font/google';
import "./globals.css";

const leagueSpartan = League_Spartan({ 
  subsets: ['latin'],
  variable: '--font-league-spartan', 
  display: 'swap'
});

const pinyonScript = Pinyon_Script({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-pinyon-script', 
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-garet',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Summit - Where Visionaries Connect",
  description: "Curated experiences and high-trust connections for elite entrepreneurs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${pinyonScript.variable} ${inter.variable}`}>
      <body className="font-garet bg-cream text-charcoal">
        {children}
      </body>
    </html>
  );
}
