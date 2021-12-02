module.exports = (mongoose) => {
  const systemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    origin: {
      type: String,
      required: true
    },
    port: Number,
    token: {
      type: String,
      required: true
    },
    resetToken: {
      type: String,
      required: true
    },
  });

  return mongoose.model('system', systemSchema);
}