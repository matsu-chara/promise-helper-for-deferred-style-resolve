# promise-deferred

jQuery.deferredのようにresolve、rejectを外部から呼ぶためのヘルパー。

```coffee
deferred = require 'promise-deferred'
{promise, resolve, reject}  = deferred(resolve, reject)
```

のように使うと、下のようなrequestを使ったテストがjQuery無しで簡単に書ける。
(テストフレームワークはmocha)


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
