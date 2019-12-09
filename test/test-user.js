var expect = require('chai').expect;
const User = require('../src/models/user.model'); 

describe('user', function() {
  it('should be invalid if FirstName is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.firstName).to.exist;
          done();
      });
  });

  it('should be invalid if LastName is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.lastName).to.exist;
          done();
      });
  });

  it('should be invalid if mail is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.mail).to.exist;
          done();
      });
  });

  it('should be invalid if login is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.login).to.exist;
          done();
      });
  });

  it('should be invalid if password is empty', function(done) {
      var user = new User();

      user.validate(function(err) {
          expect(err.errors.password).to.exist;
          done();
      });
  });
});