const mongoose = require("mongoose")
const { Schema } = mongoose

const benchmarkSchema = new Schema({
  'language': { type: String, required: true },
  'time': { type: Number, required: true },
  'result': { type: Number, required: true }
})

module.exports = mongoose.model('Benchmark', benchmarkSchema)