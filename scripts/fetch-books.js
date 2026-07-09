/**
 * fetch-books.js
 * Run with: node scripts/fetch-books.js
 * Fetches ~150 books from OpenLibrary across all app categories and writes
 * them to src/data/books.json for offline/mock use.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Helpers ────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BookNookApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function generatePrice(workId) {
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

function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

// ─── Category Definitions ────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Fiction',      subject: 'fiction',      limit: 25 },
  { name: 'Science',      subject: 'science',      limit: 20 },
  { name: 'History',      subject: 'history',      limit: 20 },
  { name: 'Fantasy',      subject: 'fantasy',      limit: 20 },
  { name: 'Biography',    subject: 'biography',    limit: 20 },
  { name: 'Technology',   subject: 'technology',   limit: 15 },
  { name: 'Philosophy',   subject: 'philosophy',   limit: 15 },
];

const POPULAR_QUERIES = ['bestseller', 'classic literature', 'award winning novel'];
const POPULAR_LIMIT = 10; // per query, ~30 total for "All Books"

// ─── Fetchers ────────────────────────────────────────────────────────────────

async function fetchSubjectBooks(categoryName, subject, limit) {
  console.log(`  Fetching ${limit} books for category: ${categoryName}...`);
  const url = `https://openlibrary.org/subjects/${subject.toLowerCase().replace(/\s+/g, '_')}.json?details=true&limit=${limit}&offset=0`;
  const data = await get(url);
  const works = data.works || [];

  return works.map((work) => {
    const id = work.key ? work.key.replace('/works/', '') : Math.random().toString(36).substr(2, 9);
    const authors = work.authors
      ? work.authors.map((a) => a.name || 'Unknown Author')
      : ['Unknown Author'];

    return {
      id,
      title: work.title || 'Untitled Book',
      authors,
      coverUrl: getCoverUrl(work.cover_id, 'M'),
      description: work.description
        ? (typeof work.description === 'string' ? work.description : work.description.value || 'A wonderful read.')
        : 'A wonderful read.',
      publishYear: work.first_publish_year || 0,
      rating: parseFloat((3.8 + (Math.abs(id.charCodeAt(0) % 12) / 10)).toFixed(1)),
      ratingsCount: Math.abs((id.charCodeAt(0) * 47 + id.charCodeAt(1) * 13) % 8000) + 50,
      subjects: work.subject ? work.subject.slice(0, 5) : [categoryName],
      category: categoryName,
      price: generatePrice(id),
    };
  });
}

async function fetchSearchBooks(query, limit) {
  console.log(`  Fetching popular books via query: "${query}"...`);
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=1&limit=${limit}&has_fulltext=true`;
  const data = await get(url);
  const docs = data.docs || [];

  return docs.map((doc) => {
    const id = doc.key ? doc.key.replace('/works/', '') : Math.random().toString(36).substr(2, 9);
    return {
      id,
      title: doc.title || 'Untitled Book',
      authors: doc.author_name || ['Unknown Author'],
      coverUrl: getCoverUrl(doc.cover_i, 'M'),
      description: doc.first_sentence ? doc.first_sentence[0] : 'A celebrated work in its genre.',
      publishYear: doc.first_publish_year || 0,
      rating: doc.ratings_average ? parseFloat((Math.round(doc.ratings_average * 10) / 10).toFixed(1)) : parseFloat((3.8 + Math.abs(id.charCodeAt(0) % 12) / 10).toFixed(1)),
      ratingsCount: doc.ratings_count || Math.abs((id.charCodeAt(0) * 47) % 8000) + 50,
      subjects: doc.subject ? doc.subject.slice(0, 5) : [],
      category: null, // popular / all books
      price: generatePrice(id),
    };
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const allBooks = new Map(); // keyed by id to avoid duplicates

  // 1. Fetch popular/All Books
  for (const query of POPULAR_QUERIES) {
    try {
      const books = await fetchSearchBooks(query, POPULAR_LIMIT);
      books.forEach((b) => { if (!allBooks.has(b.id)) allBooks.set(b.id, b); });
      await sleep(600);
    } catch (err) {
      console.warn(`  ⚠️  Failed popular query "${query}":`, err.message);
    }
  }

  // 2. Fetch per-category books
  for (const cat of CATEGORIES) {
    try {
      const books = await fetchSubjectBooks(cat.name, cat.subject, cat.limit);
      books.forEach((b) => { if (!allBooks.has(b.id)) allBooks.set(b.id, b); });
      await sleep(700); // be polite to OpenLibrary
    } catch (err) {
      console.warn(`  ⚠️  Failed category "${cat.name}":`, err.message);
    }
  }

  const booksArray = Array.from(allBooks.values()).filter((b) => b.title && b.id);
  
  console.log(`\n✅ Total unique books fetched: ${booksArray.length}`);

  // Log category breakdown
  const breakdown = {};
  booksArray.forEach((b) => {
    const key = b.category || 'Popular';
    breakdown[key] = (breakdown[key] || 0) + 1;
  });
  console.log('Category breakdown:', breakdown);

  // Write to src/data/books.json
  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'books.json');
  fs.writeFileSync(outPath, JSON.stringify(booksArray, null, 2), 'utf8');
  console.log(`\n📚 Saved to: ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
