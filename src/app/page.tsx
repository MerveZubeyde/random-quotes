"use client";

import { useContext } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { QuotesContext } from "@/app/QuotesContext";
import { QuoteCard } from "@/app/QuoteCard";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { quotes, quoteIndex, error, handleQuoteIndexUpdate, handleLikeQuote } =
    useContext(QuotesContext);

  const { user, isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <main
        className="flex w-full flex-1 items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="size-8 animate-spin rounded-full border-4 border-muted border-t-foreground"
          role="status"
          aria-label="Loading user"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex w-full flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg rounded-3xl">
          <CardContent className="flex flex-col items-center gap-6 px-8 py-12 text-center">
            <div aria-hidden="true" className="text-5xl text-primary">
              ❝
            </div>

            <h1 className="text-3xl font-semibold">
              Discover quotes worth remembering
            </h1>

            <p className="text-muted-foreground">
              Explore inspiring quotes, save your favorites, and build a
              personal collection you can return to anytime.
            </p>

            <p className="rounded-2xl bg-muted px-5 py-3 text-sm text-muted-foreground">
              Log in from the navigation menu to get started.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const currentQuote = quotes[quoteIndex];

  if (!currentQuote) {
    return (
      <main className="flex w-full flex-1 items-center justify-center">
        <p className="text-muted-foreground">
          No quotes yet. Add one or approve quotes in the database.
        </p>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col items-center bg-background px-6 pb-20 pt-20">
      {error && (
        <p
          role="alert"
          className="mb-6 w-full max-w-4xl rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <QuoteCard
        handleLikeQuote={handleLikeQuote}
        likeCount={currentQuote.likeCount}
        quote={currentQuote.quote}
        author={currentQuote.author}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />

      <div className="mt-12 flex items-center gap-3" aria-hidden="true">
        <span className="size-3 rounded-full bg-primary" />
        <span className="size-3 rounded-full bg-muted-foreground/40" />
        <span className="size-3 rounded-full bg-muted-foreground/40" />
      </div>
    </main>
  );
}
