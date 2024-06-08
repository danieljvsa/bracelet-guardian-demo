
exports.up = async function(knex) {
    await knex.schema.createTable('bracelets',function(table){
        table.increments('braceletId').primary();
        table.string('macAddress').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('patientId').unsigned().index().references('patientId').inTable('patients');
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('bracelets');
};
