const { decode } = require("jsonwebtoken");
const Token = require("../models/token.model");

/**
 * @class TokenManager
 * @description Class responsible for managing JWT tokens such as refresh tokens.
 */
class TokenManager {
    /**
     * @async
     * @method decodeToken
     * @description Decode a JWT token to retrieve its payload.
     * @param {string} token - The JWT token to decode.
     * @returns {object|null|undefined} Returns the decoded token payload, null if decoding fails, or undefined if no token provided.
     */
    async decodeToken(token) {
        try {
            if (!token) return undefined;

            // Decode the JWT token.
            const decodedToken = decode(token, { complete: true });

            // If decodedToken is null, return null indicating decoding failure.
            if (!decodedToken) return null;

            // Extract and return the payload from the decoded token.
            const { payload } = decodedToken;
            if (payload) return payload;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > decodeToken: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * @async
     * @method storeRefreshToken
     * @description Store a new refresh token in the database.
     * @param {string} refreshToken - The refresh token value.
     * @param {string} userId - The ID of the user associated with the refresh token.
     * @param {Date} expiresAt - The expiration date of the token.
     * @returns {object|null|undefined} Returns the stored refresh token object, null if storage fails, or undefined if parameters are invalid.
     */
    async storeRefreshToken(refreshToken, userId, expiresAt) {
        try {
            if (!refreshToken || !userId || !expiresAt) return undefined;

            // Store the refresh token in the database.
            const result = await Token.create({
                userId: userId,
                refreshToken: refreshToken,
                status: true,
                expiresAt: expiresAt
            })

            // If result is null, return null indicating storage failure.
            if (!result) return null;

            // Return the stored refresh token object.
            return result;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > storeRefreshToken: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * @async
     * @method findRefreshToken
     * @description Find an existing refresh token by its value.
     * @param {string} refreshToken - The refresh token value.
     * @returns {object|boolean|undefined} Returns the existing refresh token object, false if not found, or undefined if no token provided.
     */
    async findRefreshToken(refreshToken) {
        try {
            if (!refreshToken) return undefined;

            // Find the refresh token in the database.
            const result = await Token.findOne({ refreshToken: refreshToken })

            // If token is null, return false indicating not found.
            if (!result) return null;

            // Return the token object.
            return result;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > findRefreshToken: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * @async
     * @method findRefreshTokenById
     * @description Find an existing refresh token by user ID.
     * @param {string} userId - The ID of the user associated with the refresh token.
     * @returns {object|boolean|undefined} Returns the existing refresh token object, false if not found, or undefined if no user ID provided.
     */
    async findRefreshTokenById(userId) {
        try {
            if (!userId) return undefined;

            // Find the refresh token by user ID in the database.
            const result = await Token.findOne({ userId: userId })

            // If token is null, return null indicating not found.
            if (!result) return null;

            // Return the token object.
            return result;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > findRefreshTokenById: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * @async
     * @method updateRefreshToken
     * @description Update the status of a refresh token.
     * @param {string} refreshToken - The refresh token value.
     * @param {string} userId - The ID of the user associated with the refresh token.
     * @returns {number|null|undefined} Returns the number of affected rows, null if update fails, or undefined if parameters are invalid.
     */
    async updateRefreshToken(refreshToken, userId) {
        try {
            if (!userId || !refreshToken) return undefined;

            // Update the status of the refresh token in the database.
            const result = await Token.updateOne(
                { userId: userId },
                {
                    $set: {
                        status: false
                    }
                }
            )

            // If result is null or no rows were affected, return null indicating update failure.
            if (!result) return null;

            // Return the number of affected rows.
            return result;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > updateRefreshToken: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * @async
     * @method deleteExistingRefreshTokens
     * @description Delete all existing refresh tokens associated with a user.
     * @param {string} userId - The ID of the user whose refresh tokens are to be deleted.
     * @returns {number|null|undefined} Returns the number of deleted tokens, null if deletion fails, or undefined if no user ID provided.
     */
    async deleteExistingRefreshTokens(userId) {
        try {
            if (!userId) return undefined;

            // Delete all refresh tokens associated with the user from the database.
            const result = await Token.deleteMany({ userId: userId })

            // If result is null, throw an exception.
            if (!result) throw null;

            // Return the number of deleted tokens.
            return result;
        } catch (error) {
            // Log the error and re-throw.
            console.log(
                `utils > refresh.manager.js > TokenManager > deleteAllRefreshToken: ${error.message}`
            );
            throw error;
        }
    }
}

module.exports = TokenManager;
