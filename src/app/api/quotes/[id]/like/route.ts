import { ObjectId } from "mongodb";

import { auth0 } from "@/lib/auth0";
import { updateQuoteLike } from "@/lib/quote-repository";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth0.getSession();

    if (!session?.user?.sub) {
      return Response.json(
        {
          message: "You must be logged in to update a quote.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          message: "Invalid quote ID.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();
    const action = body.action;

    if (action !== "like" && action !== "unlike") {
      return Response.json(
        {
          message: 'Action must be either "like" or "unlike".',
        },
        {
          status: 400,
        },
      );
    }

    const updatedQuote = await updateQuoteLike(id, session.user.sub, action);

    if (!updatedQuote) {
      return Response.json(
        {
          message: "Quote not found.",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      success: true,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Like API error:", error);

    return Response.json(
      {
        message: "Failed to update quote.",
      },
      {
        status: 500,
      },
    );
  }
}
