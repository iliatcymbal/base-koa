# base-koa

## Installation
1) Clone repo *git clone https://github.com/iliatcymbal/base-koa.git*
2) Go to project folder and make *npm i*
3) Run *npm start* to start server. Server is available on http://localhost:8081/
4) Check route http://localhost:8081  
   you should see `{data: 'Hello Easy User'}`
   
## API
All urls have public and private mode.  
Public urls start with `public/` prefix and do not require any authenticating credentials.  
Private urls require special cookie (ECSID) in every request. User gets this cookie after successful login.  
Do not forget to use `withCredentials` flag for CORS stuff https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/withCredentials

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


