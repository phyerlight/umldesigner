'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const db = require('@arangodb').db;
const aql = require('@arangodb').aql;

const Project = require('../models/project');
const ProjectList = require('../models/projectlist');

const projects = module.context.collection('projects');
const files = module.context.collection('files');
const projectFiles = module.context.collection('projectFiles');
const keySchema = joi.string().required().description('The key of the project');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;


router.tag('project');

router.get('list', function (req, res) {

  const projs = db._query(aql`
    FOR project IN ${projects}
      let files = (FOR f IN 1 OUTBOUND project
        ${projectFiles}
        RETURN {_key: f._key, name: f.name}
      )
    RETURN merge(project, {files: files})
  `);

  res.send(projs.toArray());
}, 'listwfiles')
  .response([ProjectList], 'A list of projects with files')
  .summary('Projects with files')
  .description(dd`
  Retrieves a JSON object of all projects with their associated files nested into the hierarchy.
`);

router.get(function (req, res) {
  res.send(projects.all());
}, 'list')
.response([Project], 'A list of projects.')
.summary('List all projects')
.description(dd`
  Retrieves a list of all projects.
`);


router.post(function (req, res) {
  const project = req.body;
  let meta;
  try {
    meta = projects.save(project);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(project, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: project._key})
  ));
  res.send(project);
}, 'create')
.body(Project, 'The project to create.')
.response(201, Project, 'The created project.')
.error(HTTP_CONFLICT, 'The project already exists.')
.summary('Create a new project')
.description(dd`
  Creates a new project from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let project
  try {
    project = projects.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(project);
}, 'detail')
.pathParam('key', keySchema)
.response(Project, 'The project.')
.summary('Fetch a project')
.description(dd`
  Retrieves a project by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const project = req.body;
  let meta;
  try {
    meta = projects.replace(key, project);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(project, meta);
  res.send(project);
}, 'replace')
.pathParam('key', keySchema)
.body(Project, 'The data to replace the project with.')
.response(Project, 'The new project.')
.summary('Replace a project')
.description(dd`
  Replaces an existing project with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let project;
  try {
    projects.update(key, patchData);
    project = projects.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  res.send(project);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the project with.'))
.response(Project, 'The updated project.')
.summary('Update a project')
.description(dd`
  Patches a project with the request body and
  returns the updated document.
`);


router.delete(':key', function (req, res) {
  const key = req.pathParams.key;
  db._executeTransaction({
    collections: {write:['projects', 'files', 'projectFiles'].map(c => module.context.collectionName(c))},
    action: function() {
      try {
        projects.remove(key);

        var fileKeys = [];
        var pfKeys = [];
        projectFiles.byExample({'_from': module.context.collectionName("projects")+'/'+key}).toArray().forEach(pf => {
          fileKeys.push(pf._to.replace(/^.*\//, ""));
          pfKeys.push(pf._key);
        });
        files.removeByKeys(fileKeys);
        projectFiles.removeByKeys(pfKeys);

      } catch (e) {
        if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
          throw httpError(HTTP_NOT_FOUND, e.message);
        }
        throw e;
      }
    }
  });
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a project')
.description(dd`
  Deletes a project from the database along with it's associated files and edges.
`);
