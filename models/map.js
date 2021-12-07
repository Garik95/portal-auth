module.exports = (mongoose) => {
  const mapSchema = new mongoose.Schema({
    dn: String,
    sn: String,
    givenName: String,
    sAMAccountName: String,
    userPrincipalName: String,
    mail: {
      type: String,
      index: true
    },
    personal_id: {
      type: mongoose.Types.ObjectId,
      default: null
    },
    cause: String
  });


  return mongoose.model('map', mapSchema);
}