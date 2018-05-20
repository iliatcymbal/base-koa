# base-koa

## Installation
1) Clone repo *git clone https://github.com/iliatcymbal/base-koa.git*
2) Go to project folder and make *npm i*
3) Run *npm start* to start server. Server is available on http://localhost:8081/
4) Check route http://localhost:8081
   you should see greeting text (aka 'Hello, user')


## Static content
Put all your html/js/css/images to _static_ folder to check how your bundle works on server


## API
All urls have public and private mode.
Public urls start with `public/` prefix and do not require any authenticating credentials.
Private urls require special cookie (ECSID) in every request. User gets this cookie after successful login.
Do not forget to use `withCredentials` flag for CORS stuff https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/withCredentials.
If you are using ES6 fetch()  method do not forget settings `credentials: 'include'` (https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch)


### User API
`public/login` _post_ { email, password } - by default there is one user in the system with `admin@a.com/admin` credentials.
On success returns object with user fields {...}
On error returns 401 error 'Password or email wrong'

There is an example for `login` request with pure js:

```
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8081/public/login');
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      throw new Error(xhr.responseText);
    }
  };
  xhr.withCredentials = true;
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(JSON.stringify({ email: 'admin@a.com', password: 'admin' }));
```

Using es6 _fetch_ method:

```
fetch('http://localhost:8081/public/login', {
    method: 'POST',
    credentials: 'include',
    headers:{
      'Content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ email: 'admin@a.com', password: 'admin' })
  })
```


AJAX example with jquery:

```
$.ajax({
  type: 'post',
  url: 'http://localhost:8081/public/login',
  data: { email: 'admin@a.com', password: 'admin' },
  xhrFields: {
    withCredentials: true
  }
});
```

`public/user` _post_ { firstname, lastname, email, password } - create new user

`user` _put_ { firstname, lastname, password } - update existing user

`public/checkUser` _get_ - if user is authenticated, return object with user {...}, in other case - 404 error { error: "User is not authenticated"}

`logout` _get_ - sends to server request to logout user

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


### Categories API
`public/categories` _get_ - get list of all categories
```
[
  {
    "id": 1,
    "title": "Kids"
  },
  {
    "title": "Robots",
    "id": 2
  }
]
```

`public/categories/id` _get_ - get category by ID, returns category as an object with "id", "title", "published" and "products" fields.
"Products" is an array with objects which describe product in this category. Can be empty or doesn't exist.
```
{
  "id": 1,
  "title": "Kids",
  "products": [
    {
      "id": 1,
      "title": "TOW TRACK"
    },
    {
      "id": 2,
      "title": "DISNEY COLLECTION",
      "published": true
    }
  ]
}
```

`categories` _post_ - { title, products? } - creates a new category, returns new category. _Title_ field is required and should be unique.
"Products" is an array with product's id `[1, 3, 4]`.

AJAX example with jquery:

```
$.ajax({
  type: 'post',
  url: 'http://localhost:8081/categories',
  data: { title: 'New category', products: [1, 2] },
  xhrFields: {
    withCredentials: true
  }
});
```

`categories/id` _put_ - { title, products? } - updates an existing category, returns updated category. _Title_ field is required and should be unique.
"Products" is an array with product's id


### Products API
`public/products` _get_ - get list of all products
```
[
   {
    "title": "TOW TRACKS",
    "id": 1,
    "price": "4.25"
  },
  {
    "title": "DISNEY COLLECTION",
    "id": 2,
    "price": "10.5"
  }
]
```

`public/products/id` _get_ - get product by ID, returns product as an object with "id", "title", "description" and "price" fields.
```
{
  "title": "HERB CABLER",
  "id": 3,
  "price": "6.75"
}
```

`products` _post_ - { title, price?, description? } - creates a new product, returns new product. _Title_ field is required and should be unique.

AJAX example with jquery:

```
$.ajax({
  type: 'post',
  url: 'http://localhost:8081/products',
  data: { title: 'New product', price: '15$' },
  xhrFields: {
    withCredentials: true
  }
});
```

`products/id` _put_ - { title, price?, description? } - updates an existing product, returns updated product. _Title_ field is required and should be unique.
