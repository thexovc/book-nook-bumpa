/**
 * fetch-books-supplement.js
 * Fetches additional books for missing/low-count categories and merges
 * them into the existing books.json.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BookNookApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function generatePrice(workId) {
  let hash = 0;
  for (let i = 0; i < workId.length; i++) hash = workId.charCodeAt(i) + ((hash << 5) - hash);
  const normalized = Math.abs(hash % 1000) / 1000;
  const price = 7.99 + normalized * (29.99 - 7.99);
  const rounded = Math.round(price);
  return Math.abs(hash) % 2 === 0 ? rounded - 0.01 : rounded - 0.51;
}

function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

// Use search endpoint with subject: prefix — more reliable than /subjects/ for some categories
async function fetchBySearchSubject(categoryName, searchQuery, offset, limit) {
  console.log(`  [${categoryName}] offset=${offset} query="${searchQuery}"...`);
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${Math.floor(offset/limit)+1}&limit=${limit}`;
  const data = await get(url);
  const docs = data.docs || [];
  return docs.map((doc) => {
    const id = doc.key ? doc.key.replace('/works/', '') : `gen-${Math.random().toString(36).substr(2,9)}`;
    return {
      id,
      title: doc.title || 'Untitled',
      authors: doc.author_name || ['Unknown Author'],
      coverUrl: getCoverUrl(doc.cover_i, 'M'),
      description: doc.first_sentence ? doc.first_sentence[0] : `An acclaimed work in ${categoryName}.`,
      publishYear: doc.first_publish_year || 0,
      rating: doc.ratings_average ? parseFloat((Math.round(doc.ratings_average * 10) / 10).toFixed(1)) : parseFloat((3.8 + Math.abs(id.charCodeAt(0) % 12) / 10).toFixed(1)),
      ratingsCount: doc.ratings_count || Math.abs((id.charCodeAt(0) * 47) % 8000) + 50,
      subjects: doc.subject ? doc.subject.slice(0, 5) : [categoryName],
      category: categoryName,
      price: generatePrice(id),
    };
  });
}

async function fetchSubject(categoryName, subject, limit, offset = 0) {
  console.log(`  [${categoryName}] subjects endpoint offset=${offset}...`);
  const url = `https://openlibrary.org/subjects/${subject}.json?details=true&limit=${limit}&offset=${offset}`;
  const data = await get(url);
  const works = data.works || [];
  return works.map((work) => {
    const id = work.key ? work.key.replace('/works/', '') : `gen-${Math.random().toString(36).substr(2,9)}`;
    const authors = work.authors ? work.authors.map((a) => a.name || 'Unknown Author') : ['Unknown Author'];
    return {
      id,
      title: work.title || 'Untitled',
      authors,
      coverUrl: getCoverUrl(work.cover_id, 'M'),
      description: `An acclaimed work in ${categoryName}.`,
      publishYear: work.first_publish_year || 0,
      rating: parseFloat((3.8 + Math.abs(id.charCodeAt(0) % 12) / 10).toFixed(1)),
      ratingsCount: Math.abs((id.charCodeAt(0) * 47 + id.charCodeAt(1) * 13) % 8000) + 50,
      subjects: work.subject ? work.subject.slice(0, 5) : [categoryName],
      category: categoryName,
      price: generatePrice(id),
    };
  });
}

async function main() {
  const outPath = path.join(__dirname, '..', 'src', 'data', 'books.json');
  const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const allBooks = new Map(existing.map((b) => [b.id, b]));
  console.log(`Starting with ${allBooks.size} existing books.\n`);

  // These categories had 0 or very low counts — fetch them specifically
  const toFetch = [
    // Science: use search for more reliable results
    { cat: 'Science',    fn: () => fetchBySearchSubject('Science', 'subject:science popular', 0, 25) },
    { cat: 'Science',    fn: () => fetchSubject('Science', 'science', 20, 20) },
    // History
    { cat: 'History',   fn: () => fetchBySearchSubject('History', 'subject:history nonfiction', 0, 25) },
    { cat: 'History',   fn: () => fetchSubject('History', 'history', 20, 20) },
    // Technology
    { cat: 'Technology', fn: () => fetchBySearchSubject('Technology', 'subject:technology computers', 0, 20) },
    { cat: 'Technology', fn: () => fetchSubject('Technology', 'computers', 15, 0) },
    // Philosophy — low count
    { cat: 'Philosophy', fn: () => fetchBySearchSubject('Philosophy', 'subject:philosophy', 0, 20) },
    { cat: 'Philosophy', fn: () => fetchSubject('Philosophy', 'philosophy', 15, 15) },
    // Extra Fiction to pad total
    { cat: 'Fiction',   fn: () => fetchSubject('Fiction', 'fiction', 20, 30) },
    // Extra Fantasy
    { cat: 'Fantasy',   fn: () => fetchSubject('Fantasy', 'fantasy', 15, 20) },
    // Extra Biography
    { cat: 'Biography', fn: () => fetchSubject('Biography', 'biography', 10, 20) },
  ];

  for (const task of toFetch) {
    try {
      const books = await task.fn();
      let added = 0;
      books.forEach((b) => {
        if (!allBooks.has(b.id)) { allBooks.set(b.id, b); added++; }
      });
      console.log(`    → Added ${added} new books for ${task.cat} (total: ${allBooks.size})`);
      await sleep(700);
    } catch (err) {
      console.warn(`  ⚠️  Failed:`, err.message);
      await sleep(1000);
    }
  }

  const booksArray = Array.from(allBooks.values()).filter((b) => b.title && b.id);

  const breakdown = {};
  booksArray.forEach((b) => {
    const key = b.category || 'Popular';
    breakdown[key] = (breakdown[key] || 0) + 1;
  });

  console.log(`\n✅ Final total: ${booksArray.length} unique books`);
  console.log('Category breakdown:', breakdown);

  fs.writeFileSync(outPath, JSON.stringify(booksArray, null, 2), 'utf8');
  console.log(`\n📚 Updated: ${outPath}`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
