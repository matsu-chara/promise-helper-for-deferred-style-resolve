# promise-helper-for-deferred-style-resolve

[![npm version](https://badge.fury.io/js/promise-helper-for-deferred-style-resolve.svg)](http://badge.fury.io/js/promise-helper-for-deferred-style-resolve)
[![Build Status](https://travis-ci.org/matsu-chara/promise-helper-for-deferred-style-resolve.svg?branch=master)](https://travis-ci.org/matsu-chara/promise-helper-for-deferred-style-resolve)
[![Coverage Status](https://coveralls.io/repos/matsu-chara/promise-helper-for-deferred-style-resolve/badge.svg)](https://coveralls.io/r/matsu-chara/promise-helper-for-deferred-style-resolve)
[![Code Climate](https://codeclimate.com/github/matsu-chara/promise-helper-for-deferred-style-resolve/badges/gpa.svg)](https://codeclimate.com/github/matsu-chara/promise-helper-for-deferred-style-resolve)

A promise helper for deferred style resolve.

You can write tests easily, without any jQuery.

The test pattern idea is from [Testing jQuery ajax with mocha and sinon](http://blog.revathskumar.com/2013/03/testing-jquery-ajax-with-mocha-and-sinon.html).

`jQuery.deferred()` can call `d.resolve()`, but `Promise` can't call `p.resolve()`. This helper allows calling p.resolve().

## How to use

Get promise objcet, resolve & reject functions via promiseDeferred()

```javascript
var promiseDeferred = require('promise-helper-for-deferred-style-resolve');

var pd = promiseDeferred(function() {
  return successCallback(data);
}, function() {
  return failCallback(data);
});

# pd object is
# {
#  promise: promise,
#  resolve: resolve,
#  reject:  reject
# }
```

If you want writing success case, you just write `pd.resolve()`, in your test case, The success calback will be called. And, you can also do failed case, call `pd.reject()`.

You can assert (and resolve) like below code.

```javascript
pd.then(function() {
    assert(callback.withArgs("success").calledOnce);
    done()
});
pd.resolve();
```


For example.

```coffee
assert   = require 'power-assert'
sinon    = require 'sinon'
request  = require 'superagent'
deferred = require 'promise-deferred'

ToDo   = require './ToDo'

describe "load all", ->
  beforeEach ->
    sinon.stub(request, 'get', (url, cb) ->
      ok = {ok: true, status: 200, text: "OK"}
      ng = {ok: false, status: 404, text: "Not Found"}
      return deferred(() -> cb ok, () -> cb ng)
    )

  afterEach ->
    request.get.restore()

  it "call the ajax once", () ->
    ToDo.loadAll(sinon.spy()).resolve()
    assert(request.get.calledOnce)

   it "yield success", () ->
    callback = sinon.spy()
    {promise, resolve} = ToDo.loadAll(callback)
    promise.then(()->
      assert(callback.withArgs(200, [t]).calledOnce)
      done()
    ).catch((e) -> done(e))
    resolve()

  it "yield error", () ->
    callback = sinon.spy()
    {promise, reject} = ToDo.loadAll(callback)
    promise.then(()->
      assert(callback.withArgs(400).calledOnce)
      done()
    ).catch((e) -> done(e))
    reject()
```
