const cors = require("cors");
const { Pool } = require("pg");
const redis = require("redis");
const express = require("express");
const bodyParser = require("body-parser");

const keys = require("./keys");

// Express setup

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Postgres setup

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl: { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
  client.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch((err) => console.error(err));
});

// Redis setup

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (_, res) => {
  res.send("Hi");
});

app.get("/values/all", async (_, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values.rows);
});

app.get("/values/current", async (_, res) => {
  redisClient.hgetall("values", (_, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Listening");
});
