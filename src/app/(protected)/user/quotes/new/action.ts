"use server";

import z from "zod";

import { auth0 } from "@/lib/auth0";
import { createQuote } from "@/lib/quote-repository";
import { AddNewQuoteState, newQuoteSchema } from "@/types/quotes";

export async function addNewQuote(
  _currentState: AddNewQuoteState,
  formData: FormData,
): Promise<AddNewQuoteState> {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!session || !user?.sub) {
    return {
      success: false,
      message: "Please log in to add a quote.",
    };
  }

  const rawData = {
    author: String(formData.get("author") ?? ""),
    quote: String(formData.get("quote") ?? ""),
  };

  const validationOutput = newQuoteSchema.safeParse(rawData);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);

    return {
      success: false,
      errors: validationErrors,
      data: rawData,
    };
  }

  await createQuote({
    quote: validationOutput.data.quote,
    author: validationOutput.data.author,
    createdBy: user.sub,
  });

  return {
    success: true,
  };
}
