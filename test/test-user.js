var expect = require('chai').expect;
const User = require('../src/models/user.model'); 

describe('user', function() {
  it('should be invalid if name is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.firstName).to.exist;
          done();
      });
  });
});