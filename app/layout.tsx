import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Apple } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <header className="container flex py-4">
          <div className="flex items-center">
            <Apple className="w-8 h-8 mr-4" />
            <h1 className="text-3xl font-bold">아이폰 비교하기</h1>
          </div>
        </header>
        <main className="flex-1 border-b border-t">{children}</main>
        <footer className="container flex py-12">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <Link href="https://github.com/denev723" className="underline underline-offset-4 ">
              Denev
            </Link>
          </p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
