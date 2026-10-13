"use client";

import { useState } from "react";
import { Heart, Quote } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author: string;
  likeCount: number;
  handleLikeQuote: () => Promise<void>;
  handleQuoteIndexUpdate: () => void;
}

export function QuoteCard({
  quote,
  author,
  likeCount,
  handleLikeQuote,
  handleQuoteIndexUpdate,
}: QuoteCardProps) {
  const [isLiking, setIsLiking] = useState(false);

  async function handleLikeClick() {
    if (isLiking) {
      return;
    }

    try {
      setIsLiking(true);
      await handleLikeQuote();
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <article className="random-quote-card">
      <button
        type="button"
        className="random-quote-like"
        onClick={handleLikeClick}
        disabled={isLiking}
        aria-label={`Like quote by ${author}`}
        aria-busy={isLiking}
      >
        <Heart size={24} fill="currentColor" className="text-rose-500" />

        <span>{isLiking ? "..." : likeCount}</span>
      </button>

      <Quote className="random-quote-symbol" />

      <blockquote className="random-quote-text">{quote}</blockquote>

      <div className="random-quote-divider" aria-hidden="true" />

      <p className="random-quote-author">— {author}</p>

      <button
        type="button"
        className="random-quote-next"
        onClick={handleQuoteIndexUpdate}
        disabled={isLiking}
      >
        Next Quote &nbsp; →
      </button>
    </article>
  );
}
