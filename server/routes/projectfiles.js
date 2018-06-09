'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const ProjectFile = require('../models/projectfile');

const projectFiles = module.context.collection('projectFiles');
const keySchema = joi.string().required()
.description('The key of the projectFile');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;


router.tag('projectFile');


const NewProjectFile = Object.assign({}, ProjectFile, {
  schema: Object.assign({}, ProjectFile.schema, {
    _from: joi.string(),
    _to: joi.string()
  })
});


router.get(function (req, res) {
  res.send(projectFiles.all());
}, 'list')
.response([ProjectFile], 'A list of projectFiles.')
.summary('List all projectFiles')
.description(dd`
  Retrieves a list of all projectFiles.
`);


router.post(function (req, res) {
  const projectFile = req.body;
  let meta;
  try {
    meta = projectFiles.save(projectFile._from, projectFile._to, projectFile);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(projectFile, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: projectFile._key})
  ));
  res.send(projectFile);
}, 'create')
.body(NewProjectFile, 'The projectFile to create.')
.response(201, ProjectFile, 'The created projectFile.')
.error(HTTP_CONFLICT, 'The projectFile already exists.')
.summary('Create a new projectFile')
.description(dd`
  Creates a new projectFile from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let projectFile
  try {
    projectFile = projectFiles.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(projectFile);
}, 'detail')
.pathParam('key', keySchema)
.response(ProjectFile, 'The projectFile.')
.summary('Fetch a projectFile')
.description(dd`
  Retrieves a projectFile by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const projectFile = req.body;
  let meta;
  try {
    meta = projectFiles.replace(key, projectFile);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(projectFile, meta);
  res.send(projectFile);
}, 'replace')
.pathParam('key', keySchema)
.body(ProjectFile, 'The data to replace the projectFile with.')
.response(ProjectFile, 'The new projectFile.')
.summary('Replace a projectFile')
.description(dd`
  Replaces an existing projectFile with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let projectFile;
  try {
    projectFiles.update(key, patchData);
    projectFile = projectFiles.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  res.send(projectFile);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the projectFile with.'))
.response(ProjectFile, 'The updated projectFile.')
.summary('Update a projectFile')
.description(dd`
  Patches a projectFile with the request body and
  returns the updated document.
`);


router.delete(':key', function (req, res) {
  const key = req.pathParams.key;
  try {
    projectFiles.remove(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a projectFile')
.description(dd`
  Deletes a projectFile from the database.
`);
