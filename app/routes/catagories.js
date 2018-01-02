const Controller = require('./controller');
const db = require('../db');

class Category extends Controller {
  constructor(name) {
    super(name);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
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
}

module.exports = new Category('categories');
