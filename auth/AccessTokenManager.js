const https = require("https");


class AccessTokenManager {
	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
		this.accessToken = null;
		this.checkoutHost = "uat.checkout-api.lipad.io";
	}

	// Method to get an access token
	async getAccessToken() {
		const postData = JSON.stringify({
			consumerKey: this.key,
			consumerSecret: this.secret,
		});
		const accessTokenPath = `/api/v1/api-auth/access-token`;
		const options = {
			hostname: this.checkoutHost,
			path: accessTokenPath,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": postData.length,
			},
		};
		let accessToken = new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					try {
						const response = JSON.parse(data);
						resolve(response.access_token);
					} catch (parseError) {
						reject(parseError);
					}
				});
			});

			req.on("error", (error) => {
				reject(error);
			});

			req.write(postData);
			req.end();
		});
		this.accessToken = accessToken;
		return this.accessToken;
	}
}

module.exports = AccessTokenManager;
