import { ObjectId } from "mongodb";

import { Collections, getDb } from "@/lib/db";
import { Quote } from "@/types/quotes";

interface QuoteDocument {
  quote: string;
  author: string;
  likedBy: string[];
  likeCount: number;
  createdBy?: string;
  adminApproved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function mapQuoteDocument(quote: QuoteDocument & { _id: ObjectId }): Quote {
  const likedBy = Array.isArray(quote.likedBy) ? quote.likedBy : [];

  return {
    _id: quote._id.toString(),
    quote: quote.quote,
    author: quote.author,
    likedBy,
    likeCount: likedBy.length,
    createdBy: quote.createdBy,
    adminApproved: quote.adminApproved,
    createdAt:
      quote.createdAt instanceof Date
        ? quote.createdAt.toISOString()
        : quote.createdAt,
    updatedAt:
      quote.updatedAt instanceof Date
        ? quote.updatedAt.toISOString()
        : quote.updatedAt,
  };
}

export async function createQuote(
  data: {
    quote: string;
    author: string;
    createdBy: string;
  },
): Promise<void> {
  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const now = new Date();

  await collection.insertOne({
    quote: data.quote,
    author: data.author,
    createdBy: data.createdBy,
    likedBy: [],
    likeCount: 0,
    adminApproved: false,
    createdAt: now,
    updatedAt: now,
  });
}
export async function getApprovedQuotes(): Promise<Quote[]> {
  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const quotes = await collection.find({ adminApproved: true }).toArray();

  return quotes.map(mapQuoteDocument);
}

export async function updateQuoteLike(
  quoteId: string,
  userId: string,
  action: "like" | "unlike",
): Promise<Quote | null> {
  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const objectId = new ObjectId(quoteId);

  if (action === "like") {
    await collection.updateOne(
      {
        _id: objectId,
        adminApproved: true,
      },
      {
        $addToSet: {
          likedBy: userId,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );
  } else {
    await collection.updateOne(
      {
        _id: objectId,
        adminApproved: true,
      },
      {
        $pull: {
          likedBy: userId,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );
  }

  const updatedQuote = await collection.findOne({
    _id: objectId,
    adminApproved: true,
  });

  if (!updatedQuote) {
    return null;
  }

  const likedBy = Array.isArray(updatedQuote.likedBy)
    ? updatedQuote.likedBy
    : [];

  await collection.updateOne(
    {
      _id: objectId,
    },
    {
      $set: {
        likeCount: likedBy.length,
      },
    },
  );

  return mapQuoteDocument(updatedQuote);
}

export async function getQuotesByUser(userId: string): Promise<Quote[]> {
  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const quotes = await collection
    .find({
      createdBy: userId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return quotes.map(mapQuoteDocument);
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const quote = await collection.findOne({
    _id: new ObjectId(id),
  });

  if (!quote) {
    return null;
  }

  return mapQuoteDocument(quote);
}

export async function updateQuoteByOwner(
  quoteId: string,
  userId: string,
  data: {
    quote: string;
    author: string;
  },
): Promise<"updated" | "not-found" | "forbidden"> {
  if (!ObjectId.isValid(quoteId)) {
    return "not-found";
  }

  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const objectId = new ObjectId(quoteId);

  const existingQuote = await collection.findOne({
    _id: objectId,
  });

  if (!existingQuote) {
    return "not-found";
  }

  if (existingQuote.createdBy !== userId) {
    return "forbidden";
  }

  await collection.updateOne(
    {
      _id: objectId,
    },
    {
      $set: {
        quote: data.quote,
        author: data.author,
        adminApproved: false,
        updatedAt: new Date(),
      },
    },
  );

  return "updated";
}

export async function deleteQuoteByOwner(
  quoteId: string,
  userId: string,
): Promise<"deleted" | "not-found" | "forbidden"> {
  if (!ObjectId.isValid(quoteId)) {
    return "not-found";
  }

  const db = await getDb();

  const collection = db.collection<QuoteDocument>(Collections.quotes);

  const objectId = new ObjectId(quoteId);

  const existingQuote = await collection.findOne({
    _id: objectId,
  });

  if (!existingQuote) {
    return "not-found";
  }

  if (existingQuote.createdBy !== userId) {
    return "forbidden";
  }

  await collection.deleteOne({
    _id: objectId,
  });

  return "deleted";
}
