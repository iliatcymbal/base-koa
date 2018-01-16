const Controller = require('./controller');

class SubCategory extends Controller {
  constructor(name) {
    super(name);

    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }

  async create(ctx, next) {
    const subcategory = await this.findByField('title', ctx.request.body.title);

    if (subcategory) {
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
}

module.exports = new SubCategory('subcategories');
