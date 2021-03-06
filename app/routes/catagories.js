const Controller = require('./controller');
const products = require('./products');

class Category extends Controller {
  constructor(name) {
    super(name);
    this.scheme = ['id', 'title', 'products', 'description', 'published'];

    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }

  async create(ctx, next) {
    const category = await this.findByField('title', ctx.request.body.title);

    if (category) {
      ctx.status = 403;
      ctx.body = { error: 'Not unique title' };
    } else {
      await super.create(ctx, next);
    }
  }

  async get(ctx) {
    let values = await this.getValue();

    if (!ctx.isAuthenticated()) {
      values = values.filter(item => item.published);
    }

    ctx.body = values.map((cat) => {
      delete cat.products;
      return cat;
    });
  }

  async getById(ctx) {
    const { id } = ctx.params;
    const item = await this.findByField('id', id);

    if (!item) {
      return ctx.throw('cannot find requested resource', 404);
    }

    const prods = await products.getValue();

    if (item.products && item.products.length) {
      item.products = prods
        .filter(prod => item.products.find(({ id }) => String(id) === String(prod.id)))
        .map(({ id, title }) => ({ id, title }));
    }
    ctx.body = item;
  }

  async update(ctx, next) {
    const updatedItem = ctx.request.body;
    const { id } = updatedItem;
    const categories = await this.findAllByField('title', updatedItem.title);
    const notUniqueTitle = categories.some(cat => id !== cat.id);

    if (notUniqueTitle || !updatedItem.title) {
      ctx.status = 403;
      ctx.body = { error: 'Not unique title' };
      return;
    }

    /*if (updatedItem.products && updatedItem.products.length) {
      updatedItem.products = updatedItem.products.map(item => item && item.id || item);
    }*/

    await super.update(ctx, next);
  }
}

module.exports = new Category('categories');
