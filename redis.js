var redis = {
  pass: process.env.REDISTOGO_URL.split(":")[2].split("@")[0],
  host: process.env.REDISTOGO_URL.split(":")[2].split("@")[1],
  port: process.env.REDISTOGO_URL.split(":")[3].substr(0, 4)
};

module.exports = redis;
