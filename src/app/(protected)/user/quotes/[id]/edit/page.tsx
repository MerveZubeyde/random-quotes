import { notFound, redirect } from "next/navigation";

import { QuoteForm } from "@/components/QuoteForm";
import { auth0 } from "@/lib/auth0";
import { getQuoteById } from "@/lib/quote-repository";

interface EditQuotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  if (quote.createdBy !== session.user.sub) {
    redirect("/user/quotes/my-quotes");
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-20">
      <div className="w-full max-w-md">
        <QuoteForm
          mode="edit"
          quoteId={quote._id}
          initialValues={{
            author: quote.author,
            quote: quote.quote,
          }}
        />
      </div>
    </main>
  );
}
