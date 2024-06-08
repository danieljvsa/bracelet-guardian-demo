
exports.up = function(knex) {
    return knex.schema.createTable('patients',function(table){
      table.increments('patientId').primary();
      table.string('patientName').notNullable();
      table.integer('age').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('orgId').unsigned().index().references('orgId').inTable('organizations');
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('patients');
};
