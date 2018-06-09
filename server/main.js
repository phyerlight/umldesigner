'use strict';

module.context.use('/projects', require('./routes/projects'), 'projects');
module.context.use('/files', require('./routes/files'), 'files');
module.context.use('/projectfiles', require('./routes/projectfiles'), 'projectfiles');
