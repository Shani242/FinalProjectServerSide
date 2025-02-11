const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    marital_status: { type: String, required: true, trim: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
