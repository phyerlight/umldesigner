'use strict';

const createRouter = require('@arangodb/foxx/router');
const db = require('@arangodb').db;

const joi = require('joi');

const projectColl = db._collection('projects');
const fileColl = db._collection('files');
const projectFilesEdge= db._collection('projectFiles');

const router = createRouter();

module.context.use(router);

router.get('/projects', (req, res) => {
  projectColl.document
})
  .response(['application/json'], "List of Projects")
  .summary("Project List")
  .description("Gets a list of projects");
