const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");

const config = require("./config");

const nodecache = require("node-cache");
const cache = new nodecache({ stdTTL: 120 });

app.use(express.json());

app.all("/*", async (request, response) => {
  const { method, path, originalUrl, body, headers } = request;
  console.log("originalUrl->", originalUrl);

  const recipient = path.split("/")[1];
  const target = config[recipient];
  console.log("target->", target);

  if (!target) {
    response.status(502).send({ message: "Cannot process the request" });
    return;
  }

  try {
    const axiosConfig = {
      method: method,
      url: `${target}${originalUrl}`,
      headers: {
        Authorization: headers.authorization,
      },
      ...(Object.keys(body || {}).length > 0 && { data: body }),
    };

    axios
      .request(axiosConfig)
      .then((resp) => {
        if (method === "GET") {
          // get from cache if exist
          if (cache?.has(recipient)) {
            console.log("Getting from cache ->", recipient);
            return response.json(cache.get(recipient));
          }
          // put to cache
          console.log("Putting to cache ->", recipient);
          cache.set(recipient, resp.data);
          response.json(resp.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response;
          response.status(status).json(data);
        } else {
          response.status(500).json({ error: error.message });
        }
      });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend For Frontend App listening on port ${port}`);
});
