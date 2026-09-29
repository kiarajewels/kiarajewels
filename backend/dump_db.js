const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, 'backup', 'mongodb');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function dump() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kiarajewels');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let c of collections) {
      const data = await mongoose.connection.db.collection(c.name).find({}).toArray();
      fs.writeFileSync(path.join(backupDir, c.name + '.json'), JSON.stringify(data, null, 2));
      console.log(`Dumped ${c.name}: ${data.length} records`);
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}
dump();
