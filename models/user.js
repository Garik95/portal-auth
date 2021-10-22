module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      default: null
    },
    last_name: {
      type: String,
      default: null
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    token: {
      type: String
    },
  });


  return mongoose.model('user',userSchema);
}