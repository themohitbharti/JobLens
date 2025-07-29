import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URL}` as string
    );
    console.log("✅ MongoDB connected", connect.connection.host);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  } catch (error: any) {
    console.error("error: ", error);
    process.exit(1);
  }
};

export default connectDB;