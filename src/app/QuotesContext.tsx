"use client";

import { createContext, type ReactNode, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { updateQuoteLike } from "@/services/quotes";
import { Quote } from "@/types/quotes";
import { getRandomNumber } from "@/utils/helper-functions";

interface QuotesContextInterface {
  quotes: Quote[];
  quoteIndex: number;
  currentQuote?: Quote;
  likedQuotes: Quote[];
  isLoading: boolean;
  error: string | null;
  handleQuoteIndexUpdate: () => void;
  handleLikeQuote: () => Promise<void>;
  handleUnlikeQuote: (quoteId: string) => Promise<void>;
}

interface QuotesContextProviderProps {
  children: ReactNode;
  initialQuotes: Quote[];
}

const InitialQuotesContext: QuotesContextInterface = {
  quotes: [],
  quoteIndex: 0,
  currentQuote: undefined,
  likedQuotes: [],
  isLoading: false,
  error: null,
  handleQuoteIndexUpdate: () => {},
  handleLikeQuote: async () => {},
  handleUnlikeQuote: async () => {},
};

function normalizeQuote(quote: Quote): Quote {
  const likedBy = Array.isArray(quote.likedBy) ? quote.likedBy : [];

  return {
    ...quote,
    likedBy,
    likeCount: likedBy.length,
  };
}

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({
  children,
  initialQuotes,
}: QuotesContextProviderProps) {
  const { user } = useUser();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>(
    initialQuotes.map(normalizeQuote),
  );
  const [error, setError] = useState<string | null>(null);

  const currentQuote = quotes[quoteIndex];

  const likedQuotes = user?.sub
    ? quotes.filter((quote) => quote.likedBy.includes(user.sub))
    : [];

  function handleQuoteIndexUpdate() {
    if (quotes.length <= 1) {
      return;
    }

    let nextIndex = quoteIndex;

    while (nextIndex === quoteIndex) {
      nextIndex = getRandomNumber(0, quotes.length - 1);
    }

    setQuoteIndex(nextIndex);
  }

  async function handleLikeQuote() {
    if (!user?.sub || !currentQuote) {
      return;
    }

    if (currentQuote.likedBy.includes(user.sub)) {
      return;
    }

    try {
      setError(null);

      const updatedQuote = normalizeQuote(
        await updateQuoteLike(currentQuote._id, "like"),
      );

      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          quote._id === updatedQuote._id ? updatedQuote : quote,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like quote");
    }
  }

  async function handleUnlikeQuote(quoteId: string) {
    if (!user?.sub) {
      return;
    }

    const quoteToUnlike = quotes.find((quote) => quote._id === quoteId);

    if (!quoteToUnlike) {
      return;
    }

    if (!quoteToUnlike.likedBy.includes(user.sub)) {
      return;
    }

    try {
      setError(null);

      const updatedQuote = normalizeQuote(
        await updateQuoteLike(quoteToUnlike._id, "unlike"),
      );

      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          quote._id === updatedQuote._id ? updatedQuote : quote,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlike quote");
    }
  }

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        quoteIndex,
        currentQuote,
        likedQuotes,
        isLoading: false,
        error,
        handleQuoteIndexUpdate,
        handleLikeQuote,
        handleUnlikeQuote,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
