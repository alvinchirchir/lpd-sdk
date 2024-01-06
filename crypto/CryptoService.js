const crypto = require("crypto");
const https = require("https");

class CryptoService {
	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
		this.algorithm = "aes-256-cbc";
	}

	validatePayload(obj) {
		const requiredKeys = [
			"msisdn",
			"account_number",
			"country_code",
			"currency_code",
			"client_code",
			"customer_email",
			"customer_first_name",
			"customer_last_name",
			"due_date",
			"merchant_transaction_id",
			"preferred_payment_option_code",
			"callback_url",
			"request_amount",
			"request_description",
			"success_redirect_url",
			"fail_redirect_url",
			"invoice_number",
			"language_code",
			"service_code",
		];
		const missingKeys = [];
		for (const key of requiredKeys) {
			if (!obj.hasOwnProperty(key)) {
				missingKeys.push(key);
			}
		}
		if (missingKeys.length > 0) {
			const missingKeyValues = missingKeys.map((key) => `${key}: ${obj[key]}`).join(", ");
			throw new Error(`Missing required keys: ${missingKeyValues}`);
		}
		return;
	}

	encryptCK(IVKey, payload) {
		//Check validity of payload
		this.validatePayload(payload);
		let key = crypto.createHash("sha256").update(IVKey).digest("hex").substring(0, 16);
		key = Buffer.from(key);
		let secret = crypto.createHash("sha256").update(this.secret).digest("hex").substring(0, 32);
		secret = Buffer.from(secret);
		const cipher = crypto.createCipheriv(this.algorithm, secret, key);
		let encryptedData = cipher.update(JSON.stringify(payload), "utf-8", "hex");
		encryptedData += cipher.final("hex");
		let base64 = Buffer.from(encryptedData, "hex").toString("base64");
		// console.log("Encrypted message: " + base64);
		return base64;
	}

	decryptCK(IVKey, payload) {
		let key = crypto.createHash("sha256").update(IVKey).digest("hex").substring(0, 16);
		key = Buffer.from(key);
		let secret = crypto.createHash("sha256").update(this.secret).digest("hex").substring(0, 32);
		secret = Buffer.from(secret);
		const decipher = crypto.createDecipheriv(this.algorithm, secret, key);
		let base64 = Buffer.from(payload, "base64").toString("hex");
		let decryptedData = decipher.update(base64, "hex", "utf-8");
		decryptedData += decipher.final("utf8");
		// console.log("Decrypted message: " + decryptedData);
		return decryptedData;
	}
}

module.exports = CryptoService;
