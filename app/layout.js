import './globals.css';

export const metadata = {
  title: 'Majlis Menyulam Kasih | Nisha & Danial',
  description: 'Utusan Majlis Raja Sehari - Wan Nisha Aqilah & Muhammad Danial Faris. 5 April 2026 di Conezion IOI Resort City, Putrajaya.',
  openGraph: {
    title: 'Majlis Menyulam Kasih | Nisha & Danial',
    description: 'Anda dijemput ke Majlis Menyulam Kasih Nisha & Danial. 5 April 2026.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/Flowericon.png" type="image/png" />
      </head>
      <body>
        <div className="page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
