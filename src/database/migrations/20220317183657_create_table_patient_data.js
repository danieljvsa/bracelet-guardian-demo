
exports.up = async function(knex) {
  await knex.schema.createTable('patient_data',function(table){
      table.increments('dataId').primary();
      table.string('distance').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('profileId').unsigned().index().references('profileId').inTable('profiles');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('patient_data');
};
