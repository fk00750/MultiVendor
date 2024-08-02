const { sign } = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// private access token key
const pathToAccessTokenPrivateKey = path.join(
    __dirname,
    "../../../keys/",
    "AccessTokenPrivateKey.pem"
);
const ACCESS_TOKEN_PRIVATE_KEY = fs.readFileSync(
    pathToAccessTokenPrivateKey,
    "utf-8"
);

// private refresh token key
const pathToRefreshTokenPrivateKey = path.join(
    __dirname,
    "../../../keys/",
    "RefreshTokenPrivateKey.pem"
);
const REFRESH_TOKEN_PRIVATE_KEY = fs.readFileSync(
    pathToRefreshTokenPrivateKey,
    "utf-8"
);

class IssueAccessAndRefreshToken {
    /**
     *@static
     *@property {string} ACCESS_PRIV_KEY - private key for access token
     */
    static ACCESS_TOKEN_PRIVATE_KEY = ACCESS_TOKEN_PRIVATE_KEY;

    /**
   *@static
   *@property {string} ACCESS_PRIV_KEY - private key for refresh token
   */
    static REFRESH_TOKEN_PRIVATE_KEY = REFRESH_TOKEN_PRIVATE_KEY;

    /**
     *@static
     *@method issueToken - issueToken method - method to generate token
     *@param {Types.ObjectId} userId - user id for payload
     *@param {string} privKey - private key to sign the token
     *@param {string} expiresIn - token expiration time
     *@returns {string} - signed token
     */
    // is this a correct way to issue the token
    static async issueToken(userId, privKey, expiresIn) {

        try {
            const payload = {
                sub: userId,
                iat: Math.floor(Date.now() / 1000),
            };

            return sign(payload, privKey, { expiresIn: expiresIn, algorithm: "RS256" });
        } catch (error) {
            console.log(`src > utils > jwt > issue.jwt.token.js > issueToken : ${error.message}`)
            throw error
        }
    }

    /**
     *@static
     *@async
     *@description issue new Access Token with expiration of 50s.
     *@param {Types.ObjectId} userId - user id for payload
     *@param {Types.String} expiresIn - expiresIn for expiration timing, default 50s
     *@returns {string} - signed access token
     */
    static async issueAccessToken(userId, expiresIn = "1y") {
        try {
            if (!userId) return
            return this.issueToken(userId, this.ACCESS_TOKEN_PRIVATE_KEY, expiresIn);
        } catch (error) {
            console.log(`src > utils > jwt > issue.jwt.token.js > issueAccessToken : ${error.message}`)
            throw error
        }
    }

    /**
     *@static
     *@async
     *@description issue new Refresh Token with expiration of 50s.
     *@param {Types.ObjectId} userId - user id for payload
     *@param {Types.String} expiresIn - expiresIn for expiration timing, default 1 year
     *@returns {string} - signed access token
     */
    static async issueRefreshToken(userId, expiresIn = "1y") {
        try {
            if (!userId) return
            return this.issueToken(userId, this.REFRESH_TOKEN_PRIVATE_KEY, expiresIn);
        } catch (error) {
            console.log(`src > utils > jwt > issue.jwt.token.js > issueRefreshToken : ${error.message}`)
            throw error
        }
    }
}

module.exports = IssueAccessAndRefreshToken