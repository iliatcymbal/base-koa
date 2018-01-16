const Controller = require('./controller');

class Products extends Controller {
  constructor(name) {
    super(name);

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
}

module.exports = new Products('products');
