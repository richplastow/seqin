var vows = require('vows'),
  assert = require('assert');
vows.describe('A yup suite').addBatch({
  'when all contexts': {
    topic: function() { return true; },
    'are valid': function (topic) {
      assert.equal(topic, true);
    }
  }
}).export(module);