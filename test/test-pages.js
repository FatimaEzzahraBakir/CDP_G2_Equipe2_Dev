var expect  = require('chai').expect;
var request = require('request');

var home_url = 'http://localhost:8080';

it('Home page status', function(done) {
  request(home_url , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});

it('Sign In page status', function(done) {
  request(home_url+'/signin' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});

it('Sign Up page status', function(done) {
  request(home_url+'/signup' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});