const _ = require('koa-route');

module.exports = (app) => {
  const {users, tasks} = require('./routes');

  app.use(_.get('/', ctx => ctx.body = 'Hello Koa user'));

  app.use(_.get('/users', users.get));
  app.use(_.get('/users/:id', users.getById));
  app.use(_.post('/user', users.create));

  app.use(_.get('/tasks', tasks.get));
  app.use(_.get('/tasks/:id', tasks.getById));
  app.use(_.post('/task', tasks.create));

  return _;
};