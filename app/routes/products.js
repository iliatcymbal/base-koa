const Controller = require('./controller');

class Products extends Controller {
  constructor(name) {
    super(name);
    this.scheme = ['id', 'price', 'title', 'description', 'image'];

    this.create = this.create.bind(this);
  }

  async create(ctx, next) {
    const product = await this.findByField('title', ctx.request.body.title);

    if (product) {
      ctx.status = 403;
      ctx.body = { error: 'Not unique title' };
    } else {
      await super.create(ctx, next);
    }
  }

  async update(ctx, next) {
    const updatedItem = ctx.request.body;
    const products = await this.findAllByField('title', updatedItem.title);

    if (products.length > 1) {
      ctx.status = 403;
      ctx.body = { error: 'Not unique title' };
    } else {
      await super.update(ctx, next);
    }
  }
}

module.exports = new Products('products');
