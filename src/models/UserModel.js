import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isDeleted : {
    type : Boolean,
    default: false
  }
}, { timestamps: true })


// export default mongoose.model('User', userSchema)

const User = mongoose.model('User', userSchema);

export default User;