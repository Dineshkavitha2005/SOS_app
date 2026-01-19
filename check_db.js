const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function checkDB() {
  const db = await open({
    filename: path.join(process.cwd(), 'db', 'safenet_users.db'),
    driver: sqlite3.Database,
  });

  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables in database:', tables);

  if (tables.some(t => t.name === 'users')) {
    console.log('Users table exists');
  } else {
    console.log('Users table does not exist');
  }

  await db.close();
}

checkDB().catch(console.error);
