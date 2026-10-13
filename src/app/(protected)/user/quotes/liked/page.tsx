"use client";

import { useContext } from "react";

import { QuotesContext } from "@/app/QuotesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LikedQuotesPage() {
  const { likedQuotes, handleUnlikeQuote } = useContext(QuotesContext);

  return (
    <main className="w-full flex-1 bg-muted/50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
            Liked Quotes
          </h1>

          <p className="text-sm text-muted-foreground">
            Quotes you have saved will appear here.
          </p>
        </div>

        {likedQuotes.length === 0 ? (
          <Card className="w-full border-border bg-card text-card-foreground shadow-sm">
            <CardContent className="flex flex-col items-start gap-3 px-5 py-7 sm:px-7">
              <p className="text-lg font-semibold text-card-foreground">
                No liked quotes yet
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Like a quote from the home page and it will be saved here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-5">
            {likedQuotes.map((quote) => (
              <Card
                key={quote._id}
                className="w-full border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="flex flex-col gap-5 px-5 py-6 sm:px-7">
                  <p className="text-lg font-medium leading-relaxed text-card-foreground sm:text-xl">
                    {quote.quote}
                  </p>

                  <p className="text-right text-sm font-semibold text-muted-foreground sm:text-base">
                    - {quote.author}
                  </p>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">
                      ❤️ {quote.likeCount}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleUnlikeQuote(quote._id)}
                      aria-label={`Unlike quote by ${quote.author}`}
                    >
                      Unlike
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
