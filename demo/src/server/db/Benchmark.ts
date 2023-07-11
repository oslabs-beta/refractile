import mongoose from "mongoose"
const { Schema } = mongoose

const benchmarkSchema = new Schema({
  'language': { type: String, required: true },
  'input': { type: Number, required: true },
  'time': { type: Number, required: true }
})

const Benchmark = mongoose.model('Benchmark', benchmarkSchema)

export default Benchmark