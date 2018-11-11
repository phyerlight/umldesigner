'use strict';
const _ = require('lodash');
const joi = require('joi');

const Point = joi.object().keys({
  x: joi.number().required(),
  y: joi.number().required()
});

const FileEntity = joi.object({
    id: joi.number(),
    type: joi.string()
}).unknown(true);


module.exports = {
  schema: {
    // Describe the attributes with joi here
    _key: joi.string(),
    project_key: joi.string(),
    type: joi.string().required(),
    name: joi.string().required(),
    createdBy_key: joi.string().required(),
    createOn: joi.string().required(),
    modifiedBy_key: joi.string().required(),
    modifiedOn: joi.string().required(),
    nextEntityId: joi.array().items(joi.number()),
    entities: joi.object().pattern(/.*/, FileEntity)
  },
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
