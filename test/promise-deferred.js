var assert = require('chai').assert;
var sinon   = require('sinon');

var deferred = require('../lib/promise-deferred');

describe('promise-deferred', function() {
  "use strict";
  var deferredAsync = function(callback) {
    return deferred(function() {
      callback("success");
    }, function() {
      callback("fail");
    });
  };

  it('should return promise, resolve, reject', function() {
    assert.equal(typeof deferredAsync().promise.then, "function");
    assert.equal(typeof deferredAsync().resolve, "function");
    assert.equal(typeof deferredAsync().reject, "function");
  });

  it('should call success when resolved', function(done) {
    var callback = sinon.spy();
    var pd = deferredAsync(callback);

    pd.promise.then(function() {
      assert(callback.withArgs("success").calledOnce);
      done();
    }).catch(function(e) {
      done(e);
    });
    pd.resolve();
  });

  it('should call fail when rejected', function(done) {
    var callback = sinon.spy();
    var pd = deferredAsync(callback);

    pd.promise.then(function() {
      assert(callback.withArgs("fail").calledOnce);
      done();
    }).catch(function(e) {
      done(e);
    });
    pd.reject();
  });
});
