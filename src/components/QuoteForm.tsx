"use client";

import { useState } from "react";
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
import { NewQuoteInput, newQuoteSchema } from "@/types/quotes";

interface QuoteFormProps {
  mode: "create" | "edit";
  quoteId?: string;
  initialValues?: NewQuoteInput;
}

export function QuoteForm({ mode, quoteId, initialValues }: QuoteFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewQuoteInput>({
    mode: "onBlur",
    resolver: zodResolver(newQuoteSchema),
    defaultValues: initialValues ?? {
      author: "",
      quote: "",
    },
  });

  async function onSubmit(data: NewQuoteInput) {
    if (mode !== "edit" || !quoteId) {
      return;
    }

    try {
      setIsPending(true);
      setServerError(null);

      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update quote.");
      }

      router.push("/user/quotes/my-quotes");
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Failed to update quote.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>
            {mode === "edit" ? "Edit Quote" : "Add A New Quote"}
          </FieldLegend>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="author">Author</FieldLabel>

              <Input
                id="author"
                type="text"
                aria-invalid={!!errors.author}
                aria-describedby={errors.author ? "author-error" : undefined}
                {...register("author")}
              />

              {errors.author && (
                <div id="author-error" aria-live="polite">
                  <FieldError errors={errors.author.message}>
                    {errors.author.message}
                  </FieldError>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="quote">Quote</FieldLabel>

              <Textarea
                id="quote"
                className="resize-none"
                aria-invalid={!!errors.quote}
                aria-describedby={errors.quote ? "quote-error" : undefined}
                {...register("quote")}
              />

              {errors.quote && (
                <div id="quote-error" aria-live="polite">
                  <FieldError errors={errors.quote.message}>
                    {errors.quote.message}
                  </FieldError>
                </div>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Create"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => reset(initialValues)}
          >
            Reset
          </Button>
        </Field>

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}
      </FieldGroup>
    </form>
  );
}
