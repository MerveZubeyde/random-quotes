"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Heart,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Quote,
  UserRound,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

const appRoutes = [
  {
    name: "Home",
    url: "/",
    protectedPage: false,
    icon: Home,
  },
  {
    name: "Liked Quotes",
    url: "/user/quotes/liked",
    protectedPage: true,
    icon: Heart,
  },
  {
    name: "My Quotes",
    url: "/user/quotes/my-quotes",
    protectedPage: true,
    icon: UserRound,
  },
];

export function TopNav() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  const baseLinkClassName = [
    "flex h-12 items-center gap-2 rounded-2xl px-5",
    "whitespace-nowrap text-base font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" ");

  function getLinkClassName(url: string) {
    const isActive = pathname === url;

    return [
      baseLinkClassName,
      isActive
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
    ].join(" ");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="w-full border-b border-border/70 bg-card/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-370 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 lg:min-h-31.5">
          <div className="flex shrink-0 items-center gap-3 lg:w-75 lg:gap-4">
            <Quote className="size-11 text-primary" />

            <div>
              <p className="text-xl font-semibold leading-tight text-foreground">
                Random Quotes
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Inspire • Reflect • Grow
              </p>
            </div>
          </div>

          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center gap-3 sm:flex"
          >
            {appRoutes.map(({ name, url, protectedPage, icon: Icon }) => {
              if (protectedPage && !user) {
                return null;
              }

              return (
                <Link key={url} href={url} className={getLinkClassName(url)}>
                  <Icon className="size-5" />
                  {name}
                </Link>
              );
            })}

            {user ? (
              <>
                <Link
                  href="/user/quotes/new"
                  className={getLinkClassName("/user/quotes/new")}
                >
                  <PlusCircle className="size-5" />
                  Add a quote
                </Link>

                <Link
                  href="/auth/logout"
                  className={[
                    baseLinkClassName,
                    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                  ].join(" ")}
                >
                  <LogOut className="size-5" />
                  Log out
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className={[
                  baseLinkClassName,
                  "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                ].join(" ")}
              >
                Log in
              </Link>
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3 sm:hidden"
          >
            {appRoutes.map(({ name, url, protectedPage, icon: Icon }) => {
              if (protectedPage && !user) {
                return null;
              }

              return (
                <Link
                  key={url}
                  href={url}
                  className={getLinkClassName(url)}
                  onClick={closeMenu}
                >
                  <Icon className="size-5" />
                  {name}
                </Link>
              );
            })}

            {user ? (
              <>
                <Link
                  href="/user/quotes/new"
                  className={getLinkClassName("/user/quotes/new")}
                  onClick={closeMenu}
                >
                  <PlusCircle className="size-5" />
                  Add a quote
                </Link>

                <Link
                  href="/auth/logout"
                  className={[
                    baseLinkClassName,
                    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                  ].join(" ")}
                  onClick={closeMenu}
                >
                  <LogOut className="size-5" />
                  Log out
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className={[
                  baseLinkClassName,
                  "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                ].join(" ")}
                onClick={closeMenu}
              >
                Log in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
