import mongoose from "mongoose"
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
  user : {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  feed : {
    type: ObjectId,
    ref: "User"
  },
  content: {
    type: String,
    required: true
  },
  isDeleted : {
    type : Boolean,
    default: false
  }

}, { timestamps: true })


export default mongoose.model('Comment', commentSchema)