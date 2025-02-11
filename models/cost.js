const mongoose = require("mongoose");

const costSchema = new mongoose.Schema({
    userid: { type: Number, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["food", "health", "housing", "sport", "education"] },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const Cost = mongoose.model("Cost", costSchema);
module.exports = Cost;
