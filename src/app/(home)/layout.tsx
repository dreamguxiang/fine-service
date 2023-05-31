import Nav from "./(components)/Nav";
import "./globals.css";
import Providers from "./(components)/Providers"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Fine Service</title>
        <meta name="description" content="Fine Service" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}