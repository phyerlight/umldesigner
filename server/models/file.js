'use strict';
const _ = require('lodash');
const joi = require('joi');

const Point = joi.object().keys({
  x: joi.number().required(),
  y: joi.number().required()
});

const Class = joi.object().keys({
  id: joi.string().required(),
  position: Point.required(),
  name: joi.string().required(),
  attrs: joi.array().items(joi.string())
});

const Relation = joi.object().keys({
  type: joi.string().required(),
  fromId: joi.number().required(),
  toId: joi.number().required()
});

module.exports = {
  schema: {
    // Describe the attributes with joi here
    _key: joi.string(),
    project_key: joi.string(),
    name: joi.string().required(),
    data: joi.object().keys({
      classes: joi.array().items(Class),
      relations: joi.array().items(Relation)
    })
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
