const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

/*const nodecache = require('node-cache');
const appCache = new nodecache({ stdTTL: 120 });*/

app.use(express.json());

let cache = {};
const cacheResponse = (status, data) => {
	cache = { status, data };
	setTimeout(() => {
		cache = {};
	}, 120000);
};

app.all('/*', async (request, res) => {
	const { method, path, originalUrl, body, headers } = request;
	console.log('originalUrl->', originalUrl);

	const recipient = path.split('/')[1];
	const target = process.env[recipient];
	console.log('target->', target);

	if (!target) {
		res.status(502).send({ message: 'Cannot process the request' });
		return;
	}

	/*const shouldUseCache = path === '/products' && method.toUpperCase() === 'GET';

	if (shouldUseCache && cache.data) {
		res.status(cache.status).send(cache.data);
		return;
	}*/

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
			.then((response) => res.json(response.data))
			.catch((error) => {
				if (error.response) {
					const { status, data } = error.response;

					res.status(status).json(data);
				} else {
					res.status(500).json({ error: error.message });
				}
			});
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Backend For Frontend App listening on port ${port}`);
});
