
exports.up = async function(knex) {
    await knex.schema.createTable('organizations',function(table){
        table.increments('orgId').primary();
        table.string('name').notNullable();
        table.string('code').notNullable();
        table.string('apiKey');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('organizations');
};
