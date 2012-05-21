/**
 * berry.js - copyright(c) 2012 truepattern.
 */

/** Todo's 
- deep comparison of object
- verify /new & /edit
*/

// dependencies
var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('superagent');
var _ = require('underscore');

// set up module variables

// exported methods, variables
exports.config = {};
exports.crudTester = function (url, testObj, testUpdateObj) {
  config.url = url;
  config.testObj = testObj;
  config.testUpdateObj = testUpdateObj;
  return _restInterface;
};
exports.assert = assert;
exports.expect = expect;
exports.request = request;
exports.checkObject = _isObjectPresent;

// -----------------------------------------------
// internal functions

function _restInterface() {
  var url = config.url;
  var testObj = config.testObj;
  // run thru the following tests
  // 
  it('/new', function(done) {
    request.post(url)
      .send(testObj)
      .end(function(res) {
        //console.log('res:'+JSON.stringify(res.body));
        assert.ok(_isObjectPresent(testObj, res.body), 'response mismatch');
        // update the testObj with id
        testObj.id = res.body.id;
        done();
      });
  });

  // check in list
  it('/index', function(done) {
    request.get(url)
      .end(function(res) {
        //console.log('res:'+JSON.stringify(res.body));
        assert.ok(_isObjectPresentInArray(testObj, res.body), 
                  'object NOT present - '+JSON.stringify(testObj));
        done();
      });
  });

  // modify the todo
  it('/update', function(done) {
    var uurl=url+'/'+testObj.id;
    var testUpdateObj = config.testUpdateObj;
    // lets try to update the object
    testUpdateObj.id = testObj.id;
    request.put(uurl)
      .send(testUpdateObj)
      .end(function(res) {
        //console.log('res:'+JSON.stringify(res.body));
        assert.ok(_isObjectPresent(testUpdateObj, res.body), 'response mismatch');
        done();
      });
  });

  // delete the todo
  it('/delete', function(done) {
    var durl=url+'/'+testObj.id;
    request.del(durl)
      .end(function(res) {
        assert.ok(res.ok, 'invalid status');
        done();
      });
  });
};

/* Look for if all the keys in src are present in target.
 * The relation is all in keys, target can have extra values
 * -- Make it deep compare
 */
function _isObjectPresent(src, target) {
  var mismatch=_.find(_.keys(src), function(key) { return src[key] !== target[key]; });
  return typeof mismatch==='undefined';
}

function _isObjectPresentInArray(src, target) {
  var presence=_.find(target, function(obj) { return _isObjectPresent(src, obj); });
  return typeof presence!=='undefined';
}
