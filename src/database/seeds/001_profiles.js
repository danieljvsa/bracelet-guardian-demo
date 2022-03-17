
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert([
        {profileName: 'Zodwa Olukayode'},
        {profileName: 'Gudina Nkosazana'},
        {profileName: 'Cabdulqaadir Nekesa'}
      ]);
    });
};
