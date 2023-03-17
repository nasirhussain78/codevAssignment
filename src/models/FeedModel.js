import mongoose from "mongoose"
const ObjectId = mongoose.Schema.Types.ObjectId;
const feedSchema = new mongoose.Schema({
  comment:[{
    type:ObjectId,
    ref:'Comment',
    require: true
  }],
  user: {
    type: ObjectId,
    ref: "User",
    require: true
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


export default mongoose.model('Feed', feedSchema)
