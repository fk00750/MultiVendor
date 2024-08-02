const crypto = require("crypto");
const fs = require("fs");

function generateAccessKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + "/RefreshTokenPublicKey.pem", keyPair.publicKey);

  fs.writeFileSync(
    __dirname + "/RefreshTokenPrivateKey.pem",
    keyPair.privateKey
  );
}

generateAccessKeyPair();