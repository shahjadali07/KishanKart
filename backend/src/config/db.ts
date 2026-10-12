import mongoose from 'mongoose';
import * as os from 'os';

export const connectDB = async () => {
  try {
    // Pass the os runtime adapter explicitly: the mongodb driver otherwise
    // loads it via a dynamic import(), which fails in sandboxed runtimes
    // (e.g. Jest's VM without --experimental-vm-modules).
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      runtimeAdapters: { os },
    } as any);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
