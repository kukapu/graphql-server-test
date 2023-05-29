import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://democracy:5Xucc9GuLdsMH1Ph@kukapu.jse9nk8.mongodb.net/graphQL`

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
.then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})