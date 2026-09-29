import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Product</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/stats" className="text-sm hover:underline">
                  Stats
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Developers</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm hover:underline">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/docs/contributing" className="text-sm hover:underline">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="/docs/security" className="text-sm hover:underline">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-sm hover:underline">
                  License
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Community</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/mericcintosun/alvinmunk"
                  className="text-sm hover:underline flex items-center gap-1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                  <ExternalLinkIcon className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/alvinmunk"
                  className="text-sm hover:underline flex items-center gap-1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  X / Twitter
                  <ExternalLinkIcon className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/example"
                  className="text-sm hover:underline flex items-center gap-1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Discord
                  <ExternalLinkIcon className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AlvinMunk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
