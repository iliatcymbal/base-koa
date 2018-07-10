# base-koa

## Installation
1) Clone repo *git clone https://github.com/iliatcymbal/base-koa.git*
2) Go to project folder and make *npm i*
3) Run *npm start* to start server. Server is available on http://localhost:8081/
4) Check route http://localhost:8081
   you should see greeting text (aka 'Hello, user')
5) To change port number go to _app/index.js_ and find `app.listen(8081);`. Replace `8081` with required number


## Static content
Put all your html/js/css/images to _static_ folder to check how your bundle works on server


## API
All urls have public and private mode.
Public urls start with `public/` prefix and do not require any authenticating credentials.  
Private urls require special cookie (ECSID) in every request. User gets this cookie after successful login.  
Do not forget to use `withCredentials` flag for CORS stuff (see [details](https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest/withCredentials)).  
If you are using ES6 fetch()  method do not forget settings `credentials: 'include'` ([using fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch))


## Specific endpoints
You can find description for [tasks](tasks.md) and for [categories](categories.md)



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

If you need to add new route check [new route](routing.md).
