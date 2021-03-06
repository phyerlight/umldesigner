'use strict';
const _ = require('lodash');
const joi = require('joi');

module.exports = {
  schema: joi.object({
    // Describe the attributes with joi here
    _key: joi.string(),
    name: joi.string().required(),
    files: joi.array().items(joi.object({
      _key: joi.string(),
      name: joi.string(),
      type: joi.string()
    }))
  }),
  forClient(obj) {
    // Implement outgoing transformations here
    obj = _.omit(obj, ['_id', '_rev', '_oldRev']);
    return obj;
  },
  fromClient(obj) {
    // Implement incoming transformations here
    return obj;
  }
};
