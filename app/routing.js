const Router = require('koa-router');

const _ = new Router();

const createCommonRoutes = (opts) => {
  const { routeController, name, allPrivate } = opts;
  const fields = [
    { verb: 'get', method: 'get', pub: true },
    { verb: 'get', method: 'getById', pub: true, param: 'id' },
    { verb: 'post', method: 'create' },
    { verb: 'put', method: 'update', param: 'id' },
    { verb: 'delete', method: 'delete', param: 'id' },
  ];

  fields.forEach(({ verb, method, pub, param }) => {
    const params = param ? `/:${param}` : '';
    const prefix = !allPrivate && pub ? '/public' : '';
    const uri = `${prefix}/${name}${params}`;

    _[verb](uri, routeController[method]);
  });
};

module.exports = (app) => {
  const { users, tasks, categories, products } = require('./routes');

  _.get('/', (ctx) => {
    ctx.body = { data: 'Hello Easy User' };
  });

  _.get('/users', users.get);
  _.get('/users/:id', users.getById);
  _.post('/public/user', users.create);
  _.put('/user', users.update);

  createCommonRoutes({ routeController: tasks, name: 'tasks', allPrivate: true });
  _.get('/info', tasks.getInfo);

  createCommonRoutes({ routeController: categories, name: 'categories' });

  createCommonRoutes({ routeController: products, name: 'products' });

  app.use(_.routes());

  return _;
};
