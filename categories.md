#  Categories and Products api

Base API see in [readme](README.md)


### Categories API
`shop_info` _get_ - get general info about all items, returns an object with "categories", "products" and "publishedCategories"
```
{
  categories: 5,
  publishedCategories: 0,
  products: 15
}
```

`public/categories` _get_ - get list of all categories. For non-authenticated users it returns only published categories.
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

`public/categories/{id}` _get_ - get category by ID, returns category as an object with "id", "title", "published" and "products" fields.
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

`categories/{id}` _put_ - { title, products? } - updates an existing category, returns updated category. _Title_ field is required and should be unique.
"Products" is an array with product's id  

`categories/{id}` _delete_ - delete category by id.


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

`public/products/{id}` _get_ - get product by ID, returns product as an object with "id", "title", "description" and "price" fields.
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

`products/{id}` _put_ - { title, price?, description? } - updates an existing product, returns updated product. _Title_ field is required and should be unique.

`products/{id}/upload` _post_ - { binary } - upload image to product with "id". Request data should have _multipart/form-data_ type.
Simple example:
```
...
const data = new FormData();
data.append('file', inputDomElement.files[0]);

fetch('http://localhost:8081/public/login', {
    method: 'POST',
    credentials: 'include',
    body: data
  })
```
*Note*: **do not try** to stringify body or set additional headers for content type. Also when appending data to FormData use "file" key (see example).
