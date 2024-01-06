const AccessTokenManager = require("../auth/AccessTokenManager");
const https = require("https");

class APIClient {
	constructor(consumerKey, consumerSecret) {
		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;
		this.apiKey = null;
		this.accessToken = null;
		this.checkoutHost = "uat.checkout-api.lipad.io";
	}

	async getStatusAsync(merchantTransactionId) {
		if (!this.accessToken) {
			const accessTokenManager = new AccessTokenManager(this.consumerKey, this.consumerSecret);
			this.accessToken = await accessTokenManager.getAccessToken();
		}
		const bearerToken = this.accessToken;
		const statusPath = `/api/v1/checkout/request/status`;
		const queryParams = `merchant_transaction_id=${merchantTransactionId}`;
		const options = {
			hostname: this.checkoutHost,
			path: `${statusPath}?${queryParams}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${bearerToken}`,
			},
		};
		return new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					try {
						const response = JSON.parse(data);
						resolve(response);
					} catch (parseError) {
						reject(parseError);
					}
				});
			});
			req.on("error", (error) => {
				reject(error);
			});
			req.end();
		});
	}
}

module.exports = APIClient;
