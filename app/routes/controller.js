const db = require('../db/');

module.exports = class Controller {
  constructor(name) {
    this.name = name;
    this.getValue = this.getValue.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
  }

  getValue() {
    return db.get(this.name);
  }

  async get(ctx) {
    ctx.body = await this.getValue();
  }

  async getById(ctx, id) {
    const data = await this.getValue();
    const item = data.find(value => value.id == id);

    if (!item) {
      return ctx.throw('cannot find requested resource', 404);
    }

    ctx.body = item;
  }

  async create(ctx, next) {
    const newItem = ctx.request.body;
    const data = await this.getValue();

    newItem.id = data.length + 1;
    data.push(newItem);

    ctx.body = await db.write(this.name, data, newItem);

    await next();
  }

};
