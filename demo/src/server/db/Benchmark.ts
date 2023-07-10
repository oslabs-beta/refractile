import mongoose from "mongoose"
const { Schema } = mongoose

const benchmarkSchema = new Schema({
  'language': { type: String, required: true },
  'input': { type: Number, required: true },
  'time': { type: Number, required: true }
})

export default mongoose.model('Benchmark', benchmarkSchema)