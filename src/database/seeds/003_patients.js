
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('patients').del()
    .then(function () {
      // Inserts seed entries
      return knex('patients').insert([
        {patientName: 'Zodwa Olukayode', age: 80, orgId: 1},
        {patientName: 'Gudina Nkosazana', age: 69, orgId: 1},
        {patientName: 'Cabdulqaadir Nekesa', age: 77, orgId: 1}
      ]);
    });
};
