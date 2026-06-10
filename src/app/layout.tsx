import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pencil Prototype",
  description: "Pencil → code prototype playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        geist.variable,
        "font-sans",
      )}
    >
      <body className="font-primary min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <script
          src="https://www.inflight.co/widget.js"
          data-workspace="t68btnyu"
          async
        />
      </body>
    </html>
  );
}
