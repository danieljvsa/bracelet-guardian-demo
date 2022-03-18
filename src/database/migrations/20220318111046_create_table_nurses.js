
exports.up = function(knex) {
    return knex.schema.createTable('nurses',function(table){
        table.increments('nurseId').primary();
        table.string('nurseName').notNullable();
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('nurses');
};
