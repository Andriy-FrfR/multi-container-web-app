const redis = require("redis");

const keys = require("./keys");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

const getFibNumberForIndex = (index) => {
  if (index < 2) return 1;
  return getFibNumberForIndex(index - 1) + getFibNumberForIndex(index - 2);
};

sub.on("message", (_, message) => {
  redisClient.hset("values", message, getFibNumberForIndex(parseInt(message)));
});

sub.subscribe("insert");
