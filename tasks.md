#  Tasks api

Base API see in [readme](README.md)


### Tasks API
`tasks/id` _get_ - get task by ID, returns task

`tasks` _get_ - returns array with days of the week:
[ day0, day1, day2 ... ]
where _day_ is an array of objects:
```
{
  "description": String,
  "title": String,
  "day": number,
  "id": String,
  "done": boolean | undefined
}
```
Note: the first item in the days list is a Sunday.

`tasks` _post_ - { title, description?, day } - creates new task in a day, returns new task. _Title_ and _day_ fields are required

`tasks/id` _put_ - { title, description?, id, done? } - update existing task, returns updated task
_done_ can be only *true* | *false* | *undefined*


AJAX example with jquery:

```
$.ajax({
  type: 'put',
  url: 'http://localhost:8081/tasks/01',
  data: { title: 'New', id: '01', done: true },
  xhrFields: {
    withCredentials: true
  }
});
```

`tasks/id` _delete_ - remove task with given id

`info` _get_ - return object with general tasks info
```
{
  "done": 2,
  "inProgress": 1,
  "waiting": 5,
  "total": 8
}

```
