const client = require("./connection.js");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(bodyParser.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS Swagger Implementation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3300/",
      },
    ],
  },
  apis: ["./api.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3300, () => {
  console.log("Sever is now listening at port 3300");
});

client.connect();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          firstname:
 *            type: string
 *          lastname:
 *            type: string
 *          email:
 *            type: string
 */

/**
 *  @swagger
 * /users:
 *  get:
 *    summary: This api is for getting all user lists
 *    description: This api calls in data base and pulls all the users from the list
 *    tags:
 *      - users
 *    responses:
 *      200:
 *        description: To test get method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

app.get("/users", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

/**
 *  @swagger
 * /users/{id}:
 *  get:
 *    summary: This api is for getting individual user data
 *    description: This api is for getting individual user
 *    tags:
 *      - users
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID required
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: To test get method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

app.get("/users/:id", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

/**
 *  @swagger
 * /users:
 *  post:
 *    summary: This api is for adding user
 *    description: This api is for adding user
 *    tags:
 *      - users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: To test post method
 */

app.post("/users", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into users(id, firstname, lastname, email) 
                       values(${user.id}, '${user.firstname}', '${user.lastname}', '${user.email}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: This is api is for updating user
 *    description: This api is for updating user
 *    tags:
 *      - users
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID required
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: To test put method
 */

app.put("/users/:id", (req, res) => {
  let user = req.body;
  let updateQuery = `update users
                       set firstname = '${user.firstname}',
                       lastname = '${user.lastname}',
                       email = '${user.email}'
                       where id = ${user.id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});


/**
 *  @swagger
 * /users/{id}:
 *  delete:
 *    summary: This api is for deleting individual user
 *    description: This api is for deleting individual user
 *    tags:
 *      - users
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID required
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: To test delete method
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

app.delete("/users/:id", (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});
