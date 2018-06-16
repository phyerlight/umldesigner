'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const File = require('../models/file');

const files = module.context.collection('files');
const keySchema = joi.string().required()
.description('The key of the file');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;

router.tag('file');


router.get(function (req, res) {
  res.send(files.all());
}, 'list')
.response([File], 'A list of files.')
.summary('List all files')
.description(dd`
  Retrieves a list of all files.
`);


router.post(function (req, res) {
  const file = req.body;
  let meta;
  try {
    //checking for duplicates is done using unique indexes applied in the DB on name and project_key
    meta = files.save(file);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      if (e.message.match(/\["name","project_key"\]/)) {
        throw httpError(HTTP_CONFLICT, `Filename '${file.name}' is already in use`);
      } else {
        throw httpError(HTTP_CONFLICT, e.message);
      }
    }
    throw e;
  }
  Object.assign(file, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: file._key})
  ));
  res.send(file);
}, 'create')
.body(File, 'The file to create.')
.response(201, File, 'The created file.')
.error(HTTP_CONFLICT, 'The file already exists.')
.summary('Create a new file')
.description(dd`
  Creates a new file from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let file
  try {
    file = files.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(file);
}, 'detail')
.pathParam('key', keySchema)
.response(File, 'The file.')
.summary('Fetch a file')
.description(dd`
  Retrieves a file by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const file = req.body;
  let meta;
  try {
    meta = files.replace(key, file);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      if (e.message.match(/\["name","project_key"\]/)) {
        throw httpError(HTTP_CONFLICT, `Filename '${file.name}' is already in use`);
      } else {
        throw httpError(HTTP_CONFLICT, e.message);
      }
    }
    throw e;
  }
  Object.assign(file, meta);
  res.send(file);
}, 'replace')
.pathParam('key', keySchema)
.body(File, 'The data to replace the file with.')
.response(File, 'The new file.')
.summary('Replace a file')
.description(dd`
  Replaces an existing file with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let file;
  try {
    files.update(key, patchData);
    file = files.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      if (e.message.match(/\["name","project_key"\]/)) {
        throw httpError(HTTP_CONFLICT, `Filename '${file.name}' is already in use`);
      } else {
        throw httpError(HTTP_CONFLICT, e.message);
      }
    }
    throw e;
  }
  res.send(file);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the file with.'))
.response(File, 'The updated file.')
.summary('Update a file')
.description(dd`
  Patches a file with the request body and
  returns the updated document.
`);


router.delete(':key', function (req, res) {
  const key = req.pathParams.key;
  try {
    files.remove(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a file')
.description(dd`
  Deletes a file from the database as well as it's edge to the project.
`);
