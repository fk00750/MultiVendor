const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, "Please Provide User Id"],
            unique: true,
        },
        refreshToken: {
            type: String,
            required: [true, "Please Provide Refresh Token"],
            trim: true,
        },
        status: {
            type: Boolean,
            required: true,
            default: false,
        },
        expiresAt: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true, collection: "tokens" }
);

const Token = model("tokens", tokenSchema);


module.exports = Token