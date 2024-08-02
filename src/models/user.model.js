const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, "Please Provide User Id"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please Provide Name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please Provide Email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please Provide Password"],
        },
        city: {
            type: String,
            default: null,
        },
        pincode: {
            type: Number,
            default: null
        },
    },
    { timestamps: true, collection: "users" }
);

const User = model("users", UserSchema);


module.exports = User