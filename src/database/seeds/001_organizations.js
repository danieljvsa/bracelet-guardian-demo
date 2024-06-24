/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('organizations').del()
  await knex('organizations').insert([
    {name: 'admin', code: 'admin', },
  ]);
};
