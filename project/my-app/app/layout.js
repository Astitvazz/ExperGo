import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "BubbleBlog",
  description: "A refreshed Next.js frontend for the BubbleBlog community"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
