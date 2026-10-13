import { getApprovedQuotes } from "@/lib/quote-repository";

export async function GET() {
  try {
    const quotes = await getApprovedQuotes();

    return Response.json({
      quotes,
    });
  } catch (error) {
    console.error("GET quotes error:", error);

    return Response.json(
      {
        message: "Failed to load quotes.",
        quotes: [],
      },
      {
        status: 500,
      },
    );
  }
}
