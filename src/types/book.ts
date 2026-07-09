export interface Book {
  id: string; // Open Library work key (e.g. OL45883W)
  title: string;
  authors: string[];
  coverUrl: string | null;
  description: string;
  publishYear: number;
  rating: number;
  ratingsCount: number;
  subjects: string[];
  price: number; // Deterministic hash-based price (e.g., 9.99)
  category?: string; // Primary category label used for local filtering
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}
