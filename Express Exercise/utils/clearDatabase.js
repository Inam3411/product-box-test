const db = require('../models'); 

exports.clearAllTables = async () => {
  const models = Object.keys(db);

  for (const modelName of models) {
    if (db[modelName].destroy) {
      await db[modelName].destroy({ where: {} });
      console.log(`Cleared data from ${modelName} table.`);
    }
  }

  console.log('All data cleared from the database.');
};

