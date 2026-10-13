import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";
import { getQuotesByUser } from "@/lib/quote-repository";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteActions } from "@/components/QuoteActions";

export default async function MyQuotesPage() {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect("/auth/login");
  }

  const quotes = await getQuotesByUser(session.user.sub);

  return (
    <main className="w-full flex-1 overflow-x-hidden bg-muted/50 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
            My Quotes
          </h1>

          <p className="text-sm text-muted-foreground">
            Quotes you have submitted will appear here.
          </p>
        </div>

        {quotes.length === 0 ? (
          <Card
            className="w-full min-w-0 overflow-hidden border-border bg-card text-card-foreground shadow-sm"
          >
            <CardContent className="flex min-w-0 flex-col gap-4 px-4 py-5 sm:px-7 sm:py-6">
              <p className="text-lg font-semibold">
                You haven&apos;t added any quotes yet.
              </p>

              <p className="text-sm text-muted-foreground">
                Create a quote and it will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-5">
            {quotes.map((quote) => (
              <Card
                key={quote._id}
                className="w-full border-border bg-card text-card-foreground shadow-sm"
              >
                <CardContent className="flex flex-col gap-4 px-5 py-6 sm:px-7">
                  <p className="text-lg font-medium leading-relaxed">
                    {quote.quote}
                  </p>

                  <p className="text-right text-sm font-semibold text-muted-foreground">
                    - {quote.author}
                  </p>

                  <div className="border-t border-border pt-4">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Status:{" "}
                      {quote.adminApproved ? "Approved" : "Pending review"}
                    </p>

                    <QuoteActions quoteId={quote._id} />
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
