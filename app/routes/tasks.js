const Controller = require('./controller');
const db = require('../db');

class Tasks extends Controller {
  constructor(name) {
    super(name);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(ctx) {
    const items = await this.getValue();

    items.forEach(item => item.forEach(data => delete data.description));
    ctx.body = items;

    return items;
  }

  async getInfo(ctx) {
    const items = await this.getValue();
    const result = items
      .reduce((list, item) => [...list, ...item], [])
      .reduce((data, task) => {
        const newData = { ...data };
        const { done, inProgress, waiting } = data;

        if ('done' in task === false) {
          newData.waiting = waiting + 1;
        }

        if (task.done) {
          newData.done = done + 1;
        }

        if (task.done === false) {
          newData.inProgress = inProgress + 1;
        }

        newData.total = newData.waiting + newData.done + newData.inProgress;

        return newData;
      }, { done: 0, inProgress: 0, waiting: 0 });

    ctx.body = result;

    return result;
  }

  async getById(ctx) {
    const days = await this.getValue();
    const { id } = ctx.params;
    const item = days
      .reduce((acc, items) => [...acc, ...items], [])
      .find(data => String(data.id) === String(id));

    if (!item) {
      return ctx.throw('cannot find requested task', 404);
    }

    ctx.body = item;

    return item;
  }

  async create(ctx, next) {
    const data = ctx.request.body;
    const { day, title } = data;

    if (day === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Day should be defined' };
      return;
    }

    if (!title) {
      ctx.status = 400;
      ctx.body = { error: 'Title should be defined' };
      return;
    }

    const days = await this.getValue();
    const tasks = days[day];
    const newTask = {
      ...data,
      id: `${day}${Date.now()}`,
    };

    tasks.push(newTask);

    ctx.body = await db.write(this.name, days, newTask);

    await next();
  }

  async update(ctx, next) {
    const data = ctx.request.body;
    const { id } = ctx.params;
    const { day, title, description } = data;

    if (day === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Day should be defined' };
      return;
    }

    if (id === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'ID should be defined' };
      return;
    }

    if (!title) {
      ctx.status = 400;
      ctx.body = { error: 'Title should be defined' };
      return;
    }

    const days = await this.getValue();
    const tasks = days[day];
    const task = tasks.find(item => String(item.id) === String(id));

    if (task) {
      task.title = title;
      task.description = description;

      if ('done' in data) {
        task.done = data.done;
      }
    }

    await db.write(this.name, days, task);
    ctx.body = task;

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

    const days = await this.getValue();
    const tasks = days.find(tsks => tsks.find(find));
    const task = tasks && tasks.find(find);
    const index = task && tasks.indexOf(task);

    if (index === -1 || index === undefined) {
      ctx.status = 400;
      ctx.body = { error: `Can't find task with ${id} id` };
      return;
    }

    tasks.splice(index, 1);
    await db.write(this.name, days, task);
    ctx.body = task;

    await next();
  }
}

module.exports = new Tasks('tasks');
