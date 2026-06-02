import "./globals.css";

export const metadata = {
  title: "BerryX Systems — Industrial Intelligence",
  description:
    "BerryX Systems builds AI intelligence systems for enterprises operating in complex, regulated, and mission-critical environments. Operational AI, custom platforms, and strategic advisory.",
  openGraph: {
    title: "BerryX Systems — Industrial Intelligence",
    description:
      "We become the intelligence layer. BerryX Systems designs AI systems for manufacturing, energy, logistics, financial services, agriculture, and public sector.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
