const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/revive-wardrobe';
const prodUri = process.env.PROD_MONGODB_URI;
const localDbName = process.env.LOCAL_DB_NAME || 'revive-wardrobe';
const prodDbName = process.env.PROD_DB_NAME || 'revive-wardrobe';
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const backupDbName = process.env.BACKUP_LOCAL_DB_NAME || `prod_backup_${timestamp}`;

if (!prodUri) {
  throw new Error('Missing PROD_MONGODB_URI');
}

print(`[sync] local: ${localUri} (${localDbName})`);
print(`[sync] prod: ${prodUri} (${prodDbName})`);
print(`[sync] local backup db for prod snapshot: ${backupDbName}`);

const localConn = new Mongo(localUri);
const prodConn = new Mongo(prodUri);

const localDb = localConn.getDB(localDbName);
const prodDb = prodConn.getDB(prodDbName);
const backupDb = localConn.getDB(backupDbName);

const ignoreCollections = new Set(['system.indexes', 'system.profile', 'system.views']);

function copyDb(sourceDb, targetDb, label) {
  const collections = sourceDb
    .getCollectionNames()
    .filter((name) => !ignoreCollections.has(name));

  print(`[sync] ${label} collections: ${collections.join(', ')}`);

  collections.forEach((collectionName) => {
    const source = sourceDb.getCollection(collectionName);
    const target = targetDb.getCollection(collectionName);

    const docs = source.find({}).toArray();
    target.deleteMany({});

    if (docs.length > 0) {
      target.insertMany(docs, { ordered: false });
    }

    print(`[sync] ${label} ${collectionName}: ${docs.length} docs copied`);
  });
}

// 1) backup prod -> local backup db
copyDb(prodDb, backupDb, 'backup prod -> local');

// 2) sync local -> prod
copyDb(localDb, prodDb, 'sync local -> prod');

print('[sync] completed successfully');
