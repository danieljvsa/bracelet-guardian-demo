
exports.up = async function(knex) {
  await knex.schema.createTable('users',function(table){
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('passwordResetToken');
      table.string('passwordResetExpires');
      table.boolean('isAdmin').notNullable();
      table.boolean('active').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('orgId').unsigned().index().references('orgId').inTable('organizations');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
