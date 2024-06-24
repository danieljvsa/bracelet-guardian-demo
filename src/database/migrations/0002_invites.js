
exports.up = async function(knex) {
    await knex.schema.createTable('invites',function(table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('codeResetToken');
        table.string('codeResetExpires');
        table.boolean('isAdmin').notNullable();
        table.boolean('active').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('orgId').unsigned().index().references('orgId').inTable('organizations');
        table.integer('createdBy').unsigned().index().references('id').inTable('users');
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('invites');
};
