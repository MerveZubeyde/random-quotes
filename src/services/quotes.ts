import { Quote } from "@/types/quotes";

interface QuoteApiResponse {
  quote: Quote;
  message?: string;
}

export async function updateQuoteLike(
  quoteId: string,
  action: "like" | "unlike",
): Promise<Quote> {
  const response = await fetch(`/api/quotes/${quoteId}/like`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
    }),
  });

  const data = (await response.json()) as QuoteApiResponse;

  if (!response.ok) {
    throw new Error(
      data.message ??
        (action === "like" ? "Failed to like quote" : "Failed to unlike quote"),
    );
  }

  return data.quote;
}
