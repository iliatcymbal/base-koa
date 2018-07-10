const Router = require('koa-router');
const user = require('os').userInfo();

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
    ctx.body = { data: `Hello Easy User >${user.username}<` };
  });

  _.get('/users', users.get);
  _.get('/users/:id', users.getById);
  _.post('/public/user', users.create);
  _.put('/user', users.update);

  createCommonRoutes({ routeController: tasks, name: 'tasks', allPrivate: true });
  _.get('/info', tasks.getInfo);

  createCommonRoutes({ routeController: categories, name: 'categories' });

  createCommonRoutes({ routeController: products, name: 'products' });

  _.get('/shop_info', async (ctx, next) => {
    const categoriesPromise = categories.getValue();
    const productsPromise = products.getValue();
    const catList = await categoriesPromise;
    const prodList = await productsPromise;

    ctx.body = {
      categories: catList.length || 0,
      publishedCategories: catList.filter(cat => cat.published).length,
      products: prodList.length || 0
    };
  });

  app.use(_.routes());

  return _;
};
