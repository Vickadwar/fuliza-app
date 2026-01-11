import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap", // Added for better performance
});

export const metadata: Metadata = {
  title: "CreditLimit Pro | AI-Powered Credit Solutions in Kenya",
  description: "Increase your Fuliza limit instantly with AI-powered credit scoring. Get higher M-Pesa limits and access loans from partnered financial institutions in Kenya.",
  keywords: "Fuliza limit increase, M-Pesa credit, Kenya loans, AI credit scoring, mobile money loans, credit limit boost, Kenya fintech",
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "CreditLimit Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}