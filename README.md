# The Book Nook App 📚

A premium, performant, and fully featured bookstore mobile application built with **React Native (Expo SDK 57)**, styled with **Tailwind CSS (NativeWind v5)**, and powered by the **Open Library API**.

This project serves as the technical assessment for Bumpa. It satisfies all core areas: Component Lifecycle, State Management, Custom Animations, Unit Testing, and Performance Optimization.

---

## 🌟 Key Features

- **Dynamic Catalog Browser**: Browse trending books, search by title/author, and filter by subject categories.
- **Infinite Scroll Pagination**: Optimally loads catalog items in pages of 10 to minimize memory overhead.
- **Async Book Details Page**: Loads single works with full metadata (subjects, publishing details, rating states, and long descriptions), featuring dynamic lifecycle management.
- **Robust State Management**: Scalable Zustand cart store supporting item increments, decrements, removals, and checkout totals calculations.
- **Coordinated Fly-To-Cart Animation**: Curved trajectory animating a thumbnail from the "Add to Cart" button coordinates directly onto the bottom tab bar cart icon, featuring a bouncing badge update.
- **Secure Mock Checkout**: Interactive payment form with real-time formatters (card grouping, MM/YY insert) and input validations, including loading and error states.

---

## 🛠️ Technical Stack & Choices

| Area | Solution | Rationale |
|---|---|---|
| **Styling** | **NativeWind v5 (Tailwind)** | Enables rapid utility-first styles compiled to native stylesheets. Keeps styling clean and responsive. |
| **State** | **Zustand** | Lightweight, hook-based, and modular client-state store. Avoids context re-render thrashing, requires zero boilerplate, and is extremely easy to unit test. |
| **API Integration** | **Open Library API** | A free, public, and open-source book database. Provides real-world pagination (`page` & `limit` query parameters), high-quality cover CDNs, and allows demonstrating real async HTTP lifecycles. |
| **Animations** | **React Native Reanimated 4** | Offloads animations to the native thread for smooth 60fps transitions. Crucial for hardware-accelerated curved translations. |
| **Image Caching** | **Expo Image** | Built-in memory and disk caching, blurhash placeholders, and content fit modes to solve catalog image performance bottlenecks. |
| **Unit Testing** | **Jest & React Native Testing Library (RNTL)** | Complete testing framework using modern presets to validate UI logic, store mutations, API transforms, and custom hook cycles. |

---

## 📁 Architecture & Directory Structure

```
src/
├── app/                          # Expo Router Navigation & Screen layouts
│   ├── _layout.tsx               # Root layout config (Stack Navigation, Theme & Animation providers)
│   ├── index.tsx                 # Catalog Browse screen
│   ├── cart.tsx                  # Shopping Cart screen
│   ├── checkout.tsx              # Secure checkout & payment screen
│   └── book/
│       └── [id].tsx              # Book Details (Lifecycle requirement #1)
│
├── components/                   # Reusable UI elements
│   ├── BookCard.tsx              # Grid item card representing a book listing
│   ├── BookPrice.tsx             # Formatted price renderer (Unit Tested)
│   ├── CartItem.tsx              # Quantity controls + row item (Unit Tested)
│   ├── CartBadge.tsx             # Tab-bar bouncing items count indicator
│   ├── SearchBar.tsx             # Debounced query text input
│   ├── CategoryFilter.tsx        # Horizontal category selection chips
│   ├── AddToCartButton.tsx       # Button that captures screen coordinates
│   ├── CheckoutForm.tsx          # Card payment validator form
│   ├── LoadingSkeleton.tsx       # Opacity shimmer skeletons for details and listings
│   ├── ErrorState.tsx            # Alert message with retry callback
│   ├── EmptyState.tsx            # Empty results fallback page
│   └── FlyToCartAnimation.tsx    # Curved trajectory animation overlay
│
├── store/                        # Zustand global client-state stores
│   ├── cart-store.ts             # Cart logic and selectors
│   └── search-store.ts           # Debounced search term and category store
│
├── hooks/                        # Custom lifecycle hooks
│   ├── use-books.ts              # Catalog API fetcher (Pagination, cancellation)
│   └── use-book-details.ts       # Details API fetcher (Mount triggers, cleanups)
│
├── services/                     # API client layer
│   └── api.ts                    # Open Library endpoint requests & mappings
│
├── types/                        # TypeScript definitions
│   └── book.ts                   # Types for Book, CartItem, PaginatedResponse
│
├── context/                      # React Context providers
│   └── AnimationContext.tsx      # Coordinates cart tab location and triggers
│
└── __tests__/                    # 7 unit test suites (Jest + RNTL)
    ├── components/               # UI components tests
    ├── hooks/                    # Hook lifecycle tests
    ├── services/                 # API mapping tests
    └── store/                    # State mutation tests
```

---

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

### 1. Clone the repository and install dependencies
Ensure your node environment is active (v18+ recommended):
```bash
npm install
```

### 2. Run Expo Developer Server
```bash
npx expo start
```
Use the interactive Metro terminal keys:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web browser
- Scan the QR code to open on your physical device via the **Expo Go** application.

---

## 🧪 Running Unit Tests

We have implemented a comprehensive test suite containing **7 test files** to guarantee reliability and ensure code stability.

### Run all tests
```bash
npm test
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Tested Areas:
1. **`BookPrice.test.tsx`**: Formats currencies, shows strike-through discounts, and handles size dimensions.
2. **`CartItem.test.tsx`**: Handles quantity increments, decrements, removals, and fires callback triggers.
3. **`api.test.ts`**: Verifies search response mapping, single details authors fetch concurrency, and deterministic price hashing.
4. **`CheckoutForm.test.tsx`**: Validates card number format, expiry format, CVV, email addresses, and prevents invalid submissions.
5. **`cart-store.test.ts`**: Tests Zustand actions (add, remove, update) and derived state selectors (total price, items).
6. **`SearchBar.test.tsx`**: Verifies text typing debounce and store synchronizations.
7. **`useBookDetails.test.ts`**: Validates custom hook state transitions (loading → success/error) and retry callbacks.

---

## ⚡ Performance Optimization Highlights

1. **FlatList Window Tuning**: Custom values for `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize` prevent memory leaks when rendering large book collections.
2. **Debounced API Calls**: Users typing in the `SearchBar` trigger the API only after a 300ms pause, saving network bandwidth.
3. **Memory & Disk Image Caching**: Leverages `expo-image` CDNs to cache cover thumbnails automatically and avoids redundant image re-downloads.
4. **Request Cancellation**: Custom hooks use `AbortController` to cancel in-flight HTTP requests when the user changes screens, searches, or unmounts.
5. **Memoization**: `React.memo` is implemented on `BookCard`, `CartItem`, and `BookPrice` to avoid component re-renders when parent states mutate unrelated nodes.
