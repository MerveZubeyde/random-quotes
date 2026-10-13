"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AddNewQuoteState,
  NewQuoteInput,
  newQuoteSchema,
} from "@/types/quotes";

import { addNewQuote } from "./action";

const initialAddNewQuoteState: AddNewQuoteState = {
  success: false,
};

export default function AddNewQuotePage() {
  const router = useRouter();

  const [state, dispatchAction, isPending] = useActionState<
    AddNewQuoteState,
    FormData
  >(addNewQuote, initialAddNewQuoteState);

  const {
    register,
    reset,
    formState: { errors: clientSideErrors },
  } = useForm<NewQuoteInput>({
    mode: "onBlur",
    resolver: zodResolver(newQuoteSchema),
  });

  useEffect(() => {
    if (state.success) {
      router.replace("/user/quotes/new/success");
    }
  }, [state.success, router]);

  if (isPending) {
    return (
      <main
        className="flex min-h-[50vh] w-full items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="size-8 animate-spin rounded-full border-4 border-muted border-t-foreground"
          role="status"
          aria-label="Creating quote"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-20">
      <form className="w-full max-w-md px-4" action={dispatchAction}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Add A New Quote</FieldLegend>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="author">Author</FieldLabel>

                <Input
                  type="text"
                  id="author"
                  placeholder="Evil Rabbit"
                  aria-invalid={
                    !!state.errors?.fieldErrors?.author ||
                    !!clientSideErrors.author
                  }
                  aria-describedby={
                    state.errors?.fieldErrors?.author || clientSideErrors.author
                      ? "author-error"
                      : undefined
                  }
                  defaultValue={state.data?.author}
                  {...register("author")}
                />

                {(state.errors?.fieldErrors?.author ||
                  clientSideErrors.author) && (
                  <div id="author-error" aria-live="polite">
                    {state.errors?.fieldErrors?.author && (
                      <FieldError errors={state.errors.fieldErrors.author}>
                        {state.errors.fieldErrors.author}
                      </FieldError>
                    )}

                    {clientSideErrors.author && (
                      <FieldError errors={clientSideErrors.author.message}>
                        {clientSideErrors.author.message}
                      </FieldError>
                    )}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="quote">Quote</FieldLabel>

                <Textarea
                  id="quote"
                  className="resize-none"
                  aria-invalid={
                    !!state.errors?.fieldErrors?.quote ||
                    !!clientSideErrors.quote
                  }
                  aria-describedby={
                    state.errors?.fieldErrors?.quote || clientSideErrors.quote
                      ? "quote-error"
                      : undefined
                  }
                  defaultValue={state.data?.quote}
                  {...register("quote")}
                />

                {(state.errors?.fieldErrors?.quote ||
                  clientSideErrors.quote) && (
                  <div id="quote-error" aria-live="polite">
                    {state.errors?.fieldErrors?.quote && (
                      <FieldError errors={state.errors.fieldErrors.quote}>
                        {state.errors.fieldErrors.quote}
                      </FieldError>
                    )}

                    {clientSideErrors.quote && (
                      <FieldError errors={clientSideErrors.quote.message}>
                        {clientSideErrors.quote.message}
                      </FieldError>
                    )}
                  </div>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>

            <Button variant="outline" type="button" onClick={() => reset()}>
              Clear
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {state.message && (
        <p className="mt-10" role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      )}
    </main>
  );
}
