import mongoose from 'mongoose';
import * as os from 'os';

// The mongodb driver loads its `os` runtime adapter via a dynamic
// import(), which fails inside sandboxed environments (Jest's VM).
// Passing the adapter explicitly bypasses the dynamic import.
const RUNTIME_ADAPTERS = { os } as const;

const BASE_URI = 'mongodb://127.0.0.1:27017';

export async function connectTestDB(name: string): Promise<void> {
  await mongoose.connect(`${BASE_URI}/kisankart_test_${name}`, {
    runtimeAdapters: RUNTIME_ADAPTERS,
  } as any);
}

export async function disconnectTestDB(): Promise<void> {
  await mongoose.connection.dropDatabase().catch(() => undefined);
  await mongoose.disconnect();
}

export async function clearCollections(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}
