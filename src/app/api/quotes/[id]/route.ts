import { ObjectId } from "mongodb";

import { auth0 } from "@/lib/auth0";
import { deleteQuoteByOwner, updateQuoteByOwner } from "@/lib/quote-repository";
import { newQuoteSchema } from "@/types/quotes";

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
          message: "You must be logged in to edit a quote.",
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

    const validationOutput = newQuoteSchema.safeParse({
      author: body.author,
      quote: body.quote,
    });

    if (!validationOutput.success) {
      return Response.json(
        {
          message: "Invalid quote data.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await updateQuoteByOwner(
      id,
      session.user.sub,
      validationOutput.data,
    );

    if (result === "not-found") {
      return Response.json(
        {
          message: "Quote not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result === "forbidden") {
      return Response.json(
        {
          message: "You are not allowed to edit this quote.",
        },
        {
          status: 403,
        },
      );
    }

    return Response.json({
      success: true,
      message: "Quote updated successfully.",
    });
  } catch (error) {
    console.error("Edit quote error:", error);

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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth0.getSession();

    if (!session?.user?.sub) {
      return Response.json(
        {
          message: "You must be logged in to delete a quote.",
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

    const result = await deleteQuoteByOwner(id, session.user.sub);

    if (result === "not-found") {
      return Response.json(
        {
          message: "Quote not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result === "forbidden") {
      return Response.json(
        {
          message: "You are not allowed to delete this quote.",
        },
        {
          status: 403,
        },
      );
    }

    return Response.json({
      success: true,
      message: "Quote deleted successfully.",
    });
  } catch (error) {
    console.error("Delete quote error:", error);

    return Response.json(
      {
        message: "Failed to delete quote.",
      },
      {
        status: 500,
      },
    );
  }
}
