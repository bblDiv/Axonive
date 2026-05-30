import { Plus_Jakarta_Sans, Lora } from 'next/font/google';
import '../index.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Axonive - AI-Powered Neurosurgical Planning',
  description: 'Predict tissue deformation and stress distribution in 3D brain resections using AI-driven biomechanical simulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
