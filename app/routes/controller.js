const db = require('../db/');

module.exports = class Controller {
  constructor(name) {
    this.name = name;
    this.getValue = this.getValue.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  getValue() {
    return db.get(this.name);
  }

  async get(ctx) {
    ctx.body = await this.getValue();
  }

  async getById(ctx) {
    const { id } = ctx.params;
    const item = await this.findByField('id', id);

    if (!item) {
      return ctx.throw('cannot find requested resource', 404);
    }

    ctx.body = item;
  }

  async findByField(field, value) {
    const data = await this.getValue();
    const item = data.find(val => String(val[field]) === String(value));

    return item;
  }

  async create(ctx, next) {
    const newItem = ctx.request.body;
    const data = await this.getValue();

    newItem.id = Date.now();
    data.push(newItem);

    ctx.body = await db.write(this.name, data, newItem);

    await next();
  }

  async update(ctx, next) {
    const updatedItem = ctx.request.body;
    const { id } = ctx.params;
    const data = await this.getValue();
    const item = data.find(element => String(element.id) === String(id));

    if (!item) {
      ctx.status = 404;
      ctx.body = { error: `There is no ${this.name} with such id` };
      return;
    }

    delete updatedItem.id;
    Object.assign(item, updatedItem);

    ctx.body = await db.write(this.name, data, updatedItem);

    await next();
  }

  async delete(ctx, next) {
    const { id } = ctx.params;
    const find = item => String(item.id) === String(id);

    if (id === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'ID should be defined' };
      return;
    }

    const items = await this.getValue();
    const item = items && items.find(find);
    const index = item && items.indexOf(item);

    if (index === -1 || index === undefined) {
      ctx.status = 400;
      ctx.body = { error: `Can't find entity with ${id} id` };
      return;
    }

    items.splice(index, 1);
    await db.write(this.name, items, item);
    ctx.body = item;

    await next();
  }

};
