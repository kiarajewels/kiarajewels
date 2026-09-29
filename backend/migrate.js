const { MongoClient } = require('mongodb');
require('dotenv').config();

const localUri = 'mongodb://localhost:27017/kiarajewels';
const remoteUri = process.env.MONGO_URI;

async function migrate() {
    let localClient, remoteClient;
    try {
        console.log("Connecting to local DB...");
        localClient = new MongoClient(localUri);
        await localClient.connect();
        
        console.log("Connecting to remote Atlas DB...");
        remoteClient = new MongoClient(remoteUri);
        await remoteClient.connect();
        
        const localDb = localClient.db();
        const remoteDb = remoteClient.db();
        
        const collections = await localDb.listCollections().toArray();
        
        for (const collection of collections) {
            const colName = collection.name;
            console.log(`Migrating collection: ${colName}...`);
            
            const localCollection = localDb.collection(colName);
            const docs = await localCollection.find({}).toArray();
            console.log(`Found ${docs.length} documents in local ${colName}.`);
            
            if (docs.length > 0) {
                const remoteCollection = remoteDb.collection(colName);
                
                try {
                    await remoteCollection.drop();
                } catch (e) {
                }
                
                console.log(`Inserting ${docs.length} documents into remote ${colName}...`);
                await remoteCollection.insertMany(docs);
                console.log(`✅ Successfully migrated ${docs.length} documents in ${colName}`);
            } else {
                console.log(`⏩ No documents found in ${colName}, skipping...`);
            }
        }
        
        console.log("\n🎉 Migration fully complete!");
    } catch (error) {
        console.error("Migration Failed:", error);
    } finally {
        if (localClient) await localClient.close();
        if (remoteClient) await remoteClient.close();
    }
}

migrate();
