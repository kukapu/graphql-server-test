import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://democracy:5Xucc9GuLdsMH1Ph@kukapu.jse9nk8.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true, 
})
.then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})