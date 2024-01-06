# Lipad SDK - Checkout

This repository contains a demo application showcasing the usage of Lipad Checkout. The demo covers encryption, payload creation, and checking the status of a checkout session.

## Installation

To install the required packages, run the following command:

```bash
npm install lpd-sdk

```

## Usage

A straightforward three-step procedure:

Encrypt -> Redirect -> Query status

## 1. Create an Encrypted Payload

```bash
const { CryptoService } = require("lpd-sdk");

// Your payload data
let objPayload = {
    // ... your payload properties
};

// Lipad API credentials
const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";
const IVKey = "YOUR_IV_KEY";

// Create a CryptoService instance
let cryptoService = new CryptoService(consumerKey, consumerSecret);

// Encrypt the payload
let encryptedPayload = cryptoService.encryptCK(IVKey, objPayload);

```

## 2. Redirect

After encrypting the payload, redirect to the Lipad Checkout user interface. Pass the access key and encrypted payload as query parameters:

> https://<checkout_base_url>/?access_key=<YOUR_ACCESS_KEY>&payload=<ENCRYPTED_PAYLOAD>

## 3. Query Status

```bash
const { APIClient } = require("lpd-sdk");

// Lipad API credentials
const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";

// Lipad API client
let apiClient = new APIClient(consumerKey, consumerSecret);
// Asynchronous use async await or promises
const merchantTransactionId = "YOUR_MERCHANT_TRANSACTION_ID";
let status = await apiClient.getStatus(merchantTransactionId);
// Handle the status
console.log(status);

```
