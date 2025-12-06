const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Hospital = require('./model/hospitalModel');
const Police = require('./model/PoliceModels');

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/urbania');
    console.log('✅ Connected to MongoDB');

    // Read hospital data
    const hospitalDataRaw = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../DATA/Urbania.Health-Facilities.json'), 'utf-8')
    );
    
    // Read police data
    const policeDataRaw = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../DATA/Urbania.Police.json'), 'utf-8')
    );

    // Transform _id from MongoDB export format
    const hospitalData = hospitalDataRaw.map(item => ({
      ...item,
      _id: item._id?.$oid || undefined
    }));

    const policeData = policeDataRaw.map(item => ({
      ...item,
      _id: item._id?.$oid || undefined
    }));

    // Clear existing data
    await Hospital.deleteMany({});
    await Police.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert hospital data
    await Hospital.insertMany(hospitalData);
    console.log(`✅ Imported ${hospitalData.length} hospitals`);

    // Insert police data
    await Police.insertMany(policeData);
    console.log(`✅ Imported ${policeData.length} police stations`);

    console.log('🎉 Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();
