"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface QuoteActionsProps {
  quoteId: string;
}

export function QuoteActions({ quoteId }: QuoteActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quote?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to delete quote.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quote.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/user/quotes/${quoteId}/edit`}>Edit</Link>
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-busy={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
