const Controller = require('./controller');
const products = require('./products');

class Category extends Controller {
  constructor(name) {
    super(name);

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
    const values = await this.getValue();
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
        .filter(prod => item.products.find(id => String(id) === String(prod.id)))
        .map(({ id, title }) => ({ id, title }));
    }

    ctx.body = item;
  }

  async create(ctx, next) {
    const newItem = ctx.request.body;

    if (newItem.products && newItem.products.length) {
      newItem.products = newItem.products.map(item => item && item.id || item);
    }

    super.create(ctx, next);
  }

  async update(ctx, next) {
    const updatedItem = ctx.request.body;

    if (updatedItem.products && updatedItem.products.length) {
      updatedItem.products = updatedItem.products.map(item => item && item.id || item);
    }

    super.update(ctx, next);
  }
}

module.exports = new Category('categories');
