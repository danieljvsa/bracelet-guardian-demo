
exports.up = async function(knex) {
  await knex.schema.createTable('alerts',function(table){
      table.increments('alertId').primary();
      table.string('distance').notNullable();
      table.string('address').notNullable();
      table.boolean('active').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('patientId').unsigned().index().references('patientId').inTable('patients');
      table.integer('braceletId').unsigned().index().references('braceletId').inTable('bracelets');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('alerts');
};
