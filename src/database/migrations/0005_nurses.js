
exports.up = function(knex) {
    return knex.schema.createTable('nurses',function(table){
      table.increments('nurseId').primary();
      table.string('nurseName').notNullable();
      table.string('phone').notNullable();
      table.string('division').notNullable();
      table.string('service')
      table.string('email')
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('orgId').unsigned().index().references('orgId').inTable('organizations');
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('nurses');
};
