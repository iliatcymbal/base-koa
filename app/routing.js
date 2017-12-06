const _ = require('koa-route');

module.exports = (app) => {
  const {users, tasks} = require('./routes');

  app.use(_.get('/', ctx => {
    ctx.body = {data: 'Hello Easy user'}
  }));

  app.use(_.get('/users', users.get));
  app.use(_.get('/users/:id', users.getById));
  app.use(_.post('/public/user', users.create));
  app.use(_.put('/user', users.update));

  app.use(_.get('/tasks', tasks.get));
  app.use(_.get('/tasks/:id', tasks.getById));
  app.use(_.post('/tasks', tasks.create));

  return _;
};
