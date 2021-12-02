module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String
    },
  });


  return mongoose.model('user',userSchema);
}