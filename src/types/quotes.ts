import z from "zod";

export const newQuoteSchema = z.object({
  author: z
    .string()
    .trim()
    .min(2, {
      message: "Author name should be at least 2 characters long",
    })
    .max(50, {
      message:
        "Author name should be 50 characters long maximum. Please try a shorter name.",
    }),

  quote: z
    .string()
    .trim()
    .min(5, {
      message: "Quote should be at least 5 characters long",
    })
    .max(300, {
      message:
        "Quote should be 300 characters long maximum. Please try a shorter one.",
    }),
});

export type NewQuoteInput = z.infer<typeof newQuoteSchema>;

export type AddNewQuoteState = {
  success: boolean;
  errors?: {
    formErrors: string[];
    fieldErrors: {
      author?: string[];
      quote?: string[];
    };
  };
  message?: string;
  data?: {
    author: string;
    quote: string;
  };
};

export interface Quote {
  _id: string;
  quote: string;
  author: string;
  likeCount: number;
  likedBy: string[];
  createdBy?: string;
  adminApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
