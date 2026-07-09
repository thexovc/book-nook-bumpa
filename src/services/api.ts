import booksData from '@/data/books.json';
import { Book, PaginatedResponse } from '@/types/book';

// ─── Local Data ──────────────────────────────────────────────────────────────
// All book data is stored locally for instant, offline-first access.
// The same function signatures are preserved so no other code needs to change.

const ALL_BOOKS = booksData as unknown as Book[];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Simulates a short async delay so loading states / skeleton screens still
 * behave as the component lifecycle requires.
 */
function simulateDelay(ms = 80): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Paginates an array and returns a PaginatedResponse.
 */
function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const totalResults = items.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    totalResults,
    currentPage: safePage,
    totalPages,
    hasMore: safePage < totalPages,
  };
}

// ─── Public API (same signatures as the original axios version) ───────────────

/**
 * Deterministically generates a price between $7.99 and $29.99.
 * Kept for compatibility with existing tests.
 */
export function generatePrice(workId: string): number {
  let hash = 0;
  for (let i = 0; i < workId.length; i++) {
    hash = workId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  const price = 7.99 + normalized * (29.99 - 7.99);
  const rounded = Math.round(price);
  const isEven = Math.abs(hash) % 2 === 0;
  return isEven ? rounded - 0.01 : rounded - 0.51;
}

/**
 * Constructs the Open Library cover image URL. Kept for compatibility.
 */
export function getCoverUrl(
  coverId?: number | string | null,
  size: 'S' | 'M' | 'L' = 'M'
): string | null {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

/**
 * Search books by title, author, or subject — runs entirely in-memory.
 */
export async function searchBooks(
  query: string,
  page: number = 1,
  limit: number = 10,
  _signal?: AbortSignal
): Promise<PaginatedResponse<Book>> {
  await simulateDelay(700);

  if (!query.trim()) {
    return paginate(ALL_BOOKS, page, limit);
  }

  const q = query.toLowerCase().trim();
  const filtered = ALL_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.authors.some((a) => a.toLowerCase().includes(q)) ||
      b.subjects.some((s) => s.toLowerCase().includes(q))
  );

  return paginate(filtered, page, limit);
}

/**
 * Returns popular/trending books sorted by rating.
 */
export async function getPopularBooks(
  page: number = 1,
  limit: number = 10,
  _signal?: AbortSignal
): Promise<PaginatedResponse<Book>> {
  await simulateDelay(700);

  // Sort by rating desc, then by ratingsCount desc for tie-breaking
  const sorted = [...ALL_BOOKS].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.ratingsCount - a.ratingsCount;
  });

  return paginate(sorted, page, limit);
}

/**
 * Fetch books by category/subject — filters by the `category` field or
 * falls back to checking the `subjects` array.
 */
export async function getBooksBySubject(
  subject: string,
  page: number = 1,
  limit: number = 10,
  _signal?: AbortSignal
): Promise<PaginatedResponse<Book>> {
  await simulateDelay(700);

  const normalised = subject.toLowerCase().trim();

  const filtered = ALL_BOOKS.filter((b) => {
    // Primary: category field set during data fetch
    if (b.category && b.category.toLowerCase() === normalised) return true;
    // Fallback: subjects array contains the category name
    return b.subjects.some((s) => s.toLowerCase().includes(normalised));
  });

  // Sort by rating so the best books always appear first
  const sorted = filtered.sort((a, b) => b.rating - a.rating);

  return paginate(sorted, page, limit);
}

/**
 * Get full book details by work ID — instant lookup from local data.
 * Falls back to a graceful placeholder if the book isn't found locally.
 */
export async function getBookDetails(
  workId: string,
  _signal?: AbortSignal
): Promise<Book> {
  await simulateDelay(60);

  const book = ALL_BOOKS.find((b) => b.id === workId);

  if (book) {
    return book;
  }

  // Graceful fallback — should rarely happen
  return {
    id: workId,
    title: 'Book Details',
    authors: ['Unknown Author'],
    coverUrl: null,
    description: 'Details for this book are not available offline.',
    publishYear: 0,
    rating: 0,
    ratingsCount: 0,
    subjects: [],
    price: generatePrice(workId),
  };
}

/**
 * Simulate processing checkout — unchanged from original.
 */
export async function processCheckout(
  _cartItems: any[],
  paymentDetails: { name: string; email: string; cardNumber: string },
  signal?: AbortSignal
): Promise<{ success: boolean; orderId: string }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const cleanCard = paymentDetails.cardNumber.replace(/\s+/g, '');
      const validPrefixes = ['4', '5', '2', '37'];
      const hasValidPrefix = validPrefixes.some((prefix) => cleanCard.startsWith(prefix));

      if (hasValidPrefix && cleanCard.length >= 13 && cleanCard.length <= 19) {
        resolve({
          success: true,
          orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      } else {
        resolve({ success: false, orderId: '' });
      }
    }, 1500);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}
