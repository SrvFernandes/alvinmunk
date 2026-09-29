'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 py-4">
                  <Link href="/" className="text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/features" className="text-sm font-medium">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium">
                    Pricing
                  </Link>
                  <Link href="/app" className="text-sm font-medium">
                    App
                  </Link>
                  <div className="pt-4 border-t">
                    <LanguageSwitcher variant="icon" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="text-lg font-bold">
              AlvinMunk
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="/app" className="text-sm font-medium hover:underline">
              App
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {pathname?.startsWith('/app') && (
              <LanguageSwitcher variant="icon" />
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
