import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';

// Read the extracted products
const products = JSON.parse(readFileSync('/home/ubuntu/seed_products.json', 'utf-8'));

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log(`Seeding ${products.length} products into productCatalog...`);

  let inserted = 0;
  let updated = 0;

  for (const p of products) {
    // Check if product already exists
    const [existing] = await connection.execute(
      'SELECT sku FROM product_catalog WHERE sku = ? LIMIT 1',
      [p.sku]
    );

    if (existing.length > 0) {
      await connection.execute(
        'UPDATE product_catalog SET name = ?, url = ?, originalPrice = ?, category = ? WHERE sku = ?',
        [p.name, p.url, p.price, p.category || null, p.sku]
      );
      updated++;
    } else {
      await connection.execute(
        'INSERT INTO product_catalog (sku, name, url, originalPrice, status, category) VALUES (?, ?, ?, ?, ?, ?)',
        [p.sku, p.name, p.url, p.price, 'unknown', p.category || null]
      );
      inserted++;
    }
  }

  console.log(`Done! Inserted: ${inserted}, Updated: ${updated}, Total: ${products.length}`);

  // Show category breakdown
  const [cats] = await connection.execute(
    'SELECT category, COUNT(*) as cnt FROM product_catalog GROUP BY category ORDER BY category'
  );
  console.log('\nCategory breakdown:');
  for (const row of cats) {
    console.log(`  ${row.category || 'Uncategorized'}: ${row.cnt}`);
  }

  // Show status breakdown
  const [statuses] = await connection.execute(
    'SELECT status, COUNT(*) as cnt FROM product_catalog GROUP BY status ORDER BY status'
  );
  console.log('\nStatus breakdown:');
  for (const row of statuses) {
    console.log(`  ${row.status}: ${row.cnt}`);
  }

  await connection.end();
}

main().catch(console.error);
