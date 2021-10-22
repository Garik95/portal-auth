module.exports = (mongoose) => {
    const testSchema = new mongoose.Schema({
      first_name: {
        type: String,
        required: true
      },
      last_name: {
        type: String,
        required: true
      },
      status: {
        type: Number,
        required: true
      }
    });
    return mongoose.model('tests',testSchema);
  }