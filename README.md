# TSHIRT FACTORY: Ecommerce System

Aplicación Backend de un sistema ecommerce con Express.

## Variable de entornos

Cambia el nombre del archivo __env.example__ a __.env__, s debera generar otro .env con nombre .env_test y ademas el nombre de la base de datos debe de acabar en _test por ejemplo tshirtFactoryDB_test, despues, insertar la frase o codigo secreto en el archivo, si lo deseas puedes usar este [gits](https://gist.github.com/dehamzah/3db8fec14d19af50f7fcba2e74bdfb26) para generar un codigo.

## Containers

_Debe de haber instalado [docker](https://docs.docker.com/get-docker/) y [docker-compose](https://docs.docker.com/compose/)_

Abres el terminal e introduce el siguiente comando:

```bash

docker-compose up -d # la option -d ejecuta el contenedor en segundo plano

```

Si deseas borra el contenedor:

```bash
docker-compose down
```

Para visualizar la base de datos con mongo-express en local es: [locahost:8081](http://localhost:8081/). Usuario por defecto: _admin_ y contraseña: _password_.


## Run

Para correr el proyecto introduce el siguiente comando:

```bash
# mode development:

npm run dev

# mode build: 

npm run build

# mode production:
npm run server

# mode  test:

npm run test

# mode seeder: (Recomendado para pruebas)
  # Genera los users (user, wallet, addresbook), admins, sellers, products e items
    npm run seeder charge
  # Borra la base de datos completamente
    npm run seeder drop
```

## Enpoints

_Debe de haber instalado [postman](https://www.postman.com/)_


### USER
__[POST]__ __register__:  `/users/register`

__descripción__: registrar un usuario con role por defecto `user`

```json
// request
{
    "name": "", //  nombre del usuario 
    "lastname": "", // apellido del usuario
    "email": "", // correo electronico 
    "genre": "", // el genero debe ser ['man', 'woman', 'unknown']
    "password": "" // constrasña del usuario
}
```


```json
// response
{
    "message": "User created"
}
```

__[PUT]__  __change__: `/users/change/`

__requiere__: `TOKEN`

__descripción__: cambia los datos del usuario
```json
//request
{
  
    "name": "",
    "lastname": "",
    "genre": "",
    "email": "",
    "password": ""

}
```

__[GET]__  __change__: `/users/profile/` 

__requiere__: `TOKEN`

__descripción__: obtenemos los datos del usuario

```json
// response
{
    "message": "Profile",
    "user": {
        "genre": "",
        "address": [],
        "wallet": [],
        "order": [],
        "role": "",
        "_id": "",
        "name": "",
        "lastname": "",
        "email": "",
    }
}
```

__[patch]__  __change__ __role__: `/users/change/role/:userId`

__params__: `:userId` 

__solo__: `admin`

__requiere__: `TOKEN`

__descripción__: puede cambiar el rol a `['admin','user', 'seller'`]
 
```json
//request
{
  "role": "" // puede ser ['user', 'admin', 'seller' ]
}
```


```json
//response
{
    "message": "the user email {USER_EMAIL} change to role {USER_ROLE_NEW}"
}
```

__[DELETE]__  __remove__: `/users/remove/:userId`

__params__: `:userId` 

__solo__: `admin` | `user`

__requiere__: `TOKEN`

__descripción__:  elimina un usuario

```json
//response
{
    "message": "Deleted user"
}
```

___

### AUTH
__[POST]__ __login__: `/auth/login/`

__descripción__: autentificación  de usuario  


```json
// request
{
    "email": "", // correo electronico 
    "password": "" // constrasña del usuario
}
```

```json
// response
{
    "message": "Login Success",
    "refresh_token": "" // token
}
```

___

### PRODUCTS

__[GET]__ products: `/products/`

__descripción__:  obtenemos todos productos

```json
// response
{
   "message": "Find all product",
    "product": []
}
```

__[POST]__ register: `/products/register`

__solo__: `seller`

__requiere__: `TOKEN`

__descripción__: registro de productos 

```json
// request
{
    "parent_sku": "CEP00",
    "title": "CAMISA DE POKEMON",
    "description": "Camisa de algodon",
    "price": 12.99,
    "categories": ["Camisa", "Con Estampa"],
    "items":[
        {
        "child_sku": "CEPRS",
        "stock": 30,
        "color": "rojo",
        "size": "S"
        },
        {
        "child_sku": "CEPAS",
        "stock": 30,
        "color": "azul",
        "size": "S"
        }
]
}
```

```JSON
// response
{
    "message": "Product saved {PARENT_SKU}"
}
```


__[GET]__ __search__: `/products/search?categories=&parentsku=`

__query__: `{categories, parentsku}` 

__descripción__: buscar productos según las consultas

```json
// response
{
   "message": "Found products",
    "product": []
}

```

__[GET]__ __search title__: `/products/search/title?q=`

__query__: `{q}` 

__descripción__: obtendremos el producto filtrado por el titulo

```json
// response
{
   "message": "Found products",
    "product": []
}

```


__[DELETE]__ __remove product__: `/products/remove/product/`

__solo__: `seller` | `admin`

__require__: `TOKEN`

__descripción__: elimina products y sus items

```json
// request
{
    "products": [] // productsId
}
```

```json
// response
{
    "product": {
        "n": 2,
        "ok": 1,
        "deletedCount": 2
    },
    "item": {
        "n": 10,
        "ok": 1,
        "deletedCount": 10
    }
}
```

__[DELETE]__ __remove item__: `/products/remove/item/`

__solo__: `seller` | `admin`

__require__: `TOKEN`

__descripción__: eliminar item 


```json
// request
{
    "itemId": [] 
}
```

```json

{
    "message": "Removed item on product",
    "item": {
        "n": 2,
        "ok": 1,
        "deletedCount": 2
    },
    "products": {
        "n": 2,
        "nModified": 0,
        "ok": 1
    }
}
```
____


### ADDRESSBOOK

__[GET]__ __getALL__: `/addressbook/`

__requiere__: `TOKEN`

__descripción__: obtenemos todas la direcciones del usuario

```JSON
{
    "message": "All addresses",
    "addresses": []
}
```


__[POST]__ __register__: `/addressbook/register`

__requiere__: `TOKEN`

__descripción__: registramos una dirección 

```json
//request
{
    "name": "",
    "lastname": "",
    "country": "",
    "location":  "",
    "state": "",
    "postcode": "",
    "telephone": "",
    "mobile": "",
    "isDefault": false // solo permite dos estados ['false', 'true']
}
``` 


```json 
{
  // response
    "message": "Address add",
    "address": {}
}
```


__[PUT]__ __update__: `/addressbook/update/:addressId`
__params__: `addressId`
__require__: `TOKEN`
__descripción__: actualizamos la dirección 

```json
//request
{
    "name": "",
    "lastname": "",
    "country": "",
    "location":  "",
    "state": "",
    "postcode": "",
    "telephone": "",
    "mobile": "",
    "isDefault": false // solo permite dos estados ['false', 'true']
}
``` 

```json 
{
  // response
    "message": "Updated add",
    "address": {}
}
```


__[DELETE]__ __remove__: `/addressbook/remove/:addressId`

__params__: `addressId`

__require__: `TOKEN`

__descripción__: eliminamos la dirección 

```json
{
    "message": "Remove address"
}
```

____


### WALLET


__[GET]__ __getAll__: `/wallet/`
__requiere__: `TOKEN`
__description__: obtenemos todos los wallet del usuarios


```JSON
{
    "message": "Wallet",
    "wallet": []
}
```

[POST] __register__: `/wallet/register`

__require__: `TOKEN`

__descripción__: registramos una tarjeta del usuario

```json
// requiere
{
    "title": "Maria Rodriguez",
    "cardNumber": "5555 5555 5555 5555",
    "valid": {
        "month": 2,
        "year": 99
    },
    "balance": 0
}
```
```json
// response 
{
    "message": "creditCard add",
    "wallet": {
        "creditCard": {
            "valid": {
                "month": 2,
                "year": 99
            },
            "type": "credit",
            "balance": {
                "$numberDecimal": "0"
            },
            "isSelect": false,
            "title": "Maria Rodriguez",
            "cardNumber": "5555 5555 5555 5555"
        },
        "_id": "5f919d4fe7d57aaae96bdd80",
        "userId": "5f9186cdc22daa94e57fd0bc",
        "__v": 0
    }
}
```

__[PUT]__  __update__: `wallet/update/:walletId`
__params__: `walletId`
__require__: TOKEN 
__descripción__: actualizamos la tarjeta
```JSON
//request
    {
        "title": "Maria Rodriguez Lopez",
        "valid": {
            "month": 2,
            "year": 19
        },
        "balance": 20.99
    }
```
```JSON
// response
{
    "message": "updated credit card",
    "creditcard": {
        "title": "Maria Rodriguez Lopez",
        "valid": {
            "month": 2,
            "year": 19
        },
        "balance": 20.99
    }
}
```


__[DELETE]__  __remove__: `wallet/remove/:walletId`
__params__: `walletId`
__requiere__: `TOKEN`
__descripción__: elimina un tarjeta 

```JSON
// response
{
    "message": "Removed credit card"
}
```

____


### SHOPPING CART

__[GET]__ __/__: `/addressbook/:cartId`
__params__: `{cartId}`
__descripción__: obtenemos el pedido

```JSON
//response
{
    "message": "Find cart",
    "cart": {}
}
```

__[POST]__  __add__ : `/cart/add` 
__descripción__:  añade los productos seleccionados al carrito

```JSON
// request
{
    "productId": "",
    "itemId": ""
}
```

```json
{
  //response 
    "message": "Product in cart",
    "cart": {}
  
}
```

__[PATCH]__  __push__ : `/cart/push/:cartId`
__params__: `cartId`
__descripción__:  añade un producto a la cesta ya creado o lo actualiza en caso que sea el mismo.

```JSON
// request
{
    "productId": "",
    "itemId": "",
    "quantity":  // no se permite 0, pasa directamente a 1. para quitarlo del carrito existe el enpoint Pull
}
```

```json
{
  //response 
    "message": "Product in cart",
    "cart": {}
  
}
```
__[PATCH]__  __pull__ : `/cart/pull/:cartId`
__params__: `cartId`
__descripción__: borra un producto de la cesta

``` json
//request
{
    "subcartId": "" // se require el id subdocument 
}

```
``` json
//response 
{
    "message": "removed item on cart",
    "cart": { }
}
```
__[DELETE]__  __remove__ : `/cart/remove/:cartId`
__params__: `cartId`
__descripción__: borra el carrito de la compra

``` json
//response 
{
    "message": "Removed cart"
}
```

___


### ORDER

__[POST]__ __register__: `/order/register/:cartId`
__params__: `cartId`
__require__: `TOKEN`
__descripción__: registra un pedido  
```JSON
//response
{
    "message": "Order proccess",
    "order": { }
}
```
__[PATCH]__ __status update__: `/order/update/status/:cartId`
__solo__: `seller` | `admin`
__params__: `cartId`
__require__: `TOKEN`
__descripción__:  actualiza el estado del pedido

```json
{
    "status": "" // los estados permitidos son ['process', 'confirm', 'paid', 'shipping', 'finished','canceled']
}
```

__[PUT]__ __status canceled__: `/order/update/canceled/`
__solo__: `admin`
__params__: `cartId`
__descripción__: busca todo los pedidos con estado `canceled` y devuelve el stock

```JSON
// response
{
    "item": [
        {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    ]
}
```
____

### SHIPPING

__[POST]__ __register__: `/shipping/register/:orderId`
__params__: `orderId`
__stutus order__: `process`
__require__: `TOKEN` y una dirreción con estado `isDefault: true`
__descripción__: registra un pedido para su envio


```JSON
{
    "invoce_address": "" // opcional: si se desea otra direccion para la facturación
}

```

```JSON
{
    "message": "Order pedding for shipping",
    "shipping": {
        "_id": "5f91c1c79ab69fcfa1749cb1",
        "status": "pending",
        "shipping_address": "5f91b658e6743cc1da02fad0",
        "invoices_address": "5f91b658e6743cc1da02fad0",
        "orderId": "5f91ad30658bbfb6b7b1edab",
        "createdAt": "2020-10-22T17:30:47.548Z",
        "updatedAt": "2020-10-22T17:30:47.548Z",
        "__v": 0
    }
}
```

__[POST]__ __shipping update__: `/shipping/update/status/:shippingId`
__params__: `shippingId`
__solo__: `admin`
__require__: `TOKEN`
__descripción__:actualiza el envio dependiendo del estado del pedido: 
- Si el pedido esta en `process`, `confirm` o `paid` el estado del envio siempre sera +`pending`
-  Si el pedido se encuentra en estado `shipping` podemos introducir los estados:
    - [`'shipped out'`, `'pending delivered'`]
- Si el pedido se encuentra en estado `finished` podemos introducir los estados:
    - [`'delivered'`, `'undelivered'`]
```JSON
// request
{
    "status": "" 

}
```
```JSON
{
//response 
    "message": "shipping change",
    "newShipping": {
        "_id": "5f91c1c79ab69fcfa1749cb1",
        "status": "pending",
        "shipping_address": "5f91b658e6743cc1da02fad0",
        "invoices_address": "5f91b658e6743cc1da02fad0",
        "orderId": "5f91ad30658bbfb6b7b1edab",
        "createdAt": "2020-10-22T17:30:47.548Z",
        "updatedAt": "2020-10-22T17:36:15.148Z",
        "__v": 0
    }
}
```
__[POST]__ __/__: `/shipping/:shippingId`
__params__: `shippingId`
__require__: `TOKEN`
__descripción__: obtenemos los datos del envio y el pedido
```JSON
//response 
{
    {
    "message": "View order: {ORDER_ID}",
    "shipping": {
        "_id": "",
        "status": "",
        "shipping_address": {},
        "invoices_address": {},
        "orderId": {},

    }
}
}
```

En el botón de abajo obtendriamos todos los enpoints indicados.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4f28737529524a639f58)


## Playground 

Recomiendo hacer primero `npm run seeder charge` ya que, nos cargara unos cuantos usuarios, productos y usuario predeterminados como `jerrysmith@admin.com` y `glootie@seller.com` con la contraseña por defecto `password`



