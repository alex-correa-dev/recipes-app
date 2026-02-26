interface StorageType {
  [key: string]: string;
}

const mockStorage: StorageType = {};

type Callback = (error?: Error | null) => void;
type MultiGetCallback = (
  errors?: Error[] | null,
  result?: [string, string | null][],
) => void;
type KeyValuePair = [string, string];
type KeyValuePairs = KeyValuePair[];

const mockAsyncStorage = {
  setItem: jest.fn(
    (key: string, value: string, callback?: Callback): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          mockStorage[key] = value;
          if (callback) callback(null);
          resolve();
        } catch (error) {
          if (callback) callback(error as Error);
          reject(error);
        }
      });
    },
  ),

  getItem: jest.fn(
    (
      key: string,
      callback?: (error?: Error | null, result?: string | null) => void,
    ): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        try {
          const value = mockStorage[key] || null;
          if (callback) callback(null, value);
          resolve(value);
        } catch (error) {
          if (callback) callback(error as Error);
          reject(error);
        }
      });
    },
  ),

  removeItem: jest.fn((key: string, callback?: Callback): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        delete mockStorage[key];
        if (callback) callback(null);
        resolve();
      } catch (error) {
        if (callback) callback(error as Error);
        reject(error);
      }
    });
  }),

  clear: jest.fn((callback?: Callback): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
        if (callback) callback(null);
        resolve();
      } catch (error) {
        if (callback) callback(error as Error);
        reject(error);
      }
    });
  }),

  getAllKeys: jest.fn(
    (
      callback?: (error?: Error | null, keys?: string[]) => void,
    ): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        try {
          const keys = Object.keys(mockStorage);
          if (callback) callback(null, keys);
          resolve(keys);
        } catch (error) {
          if (callback) callback(error as Error);
          reject(error);
        }
      });
    },
  ),

  multiGet: jest.fn(
    (
      keys: string[],
      callback?: MultiGetCallback,
    ): Promise<[string, string | null][]> => {
      return new Promise((resolve, reject) => {
        try {
          const result: [string, string | null][] = keys.map((key) => [
            key,
            mockStorage[key] || null,
          ]);
          if (callback) callback(null, result);
          resolve(result);
        } catch (error) {
          if (callback) callback([error as Error]);
          reject(error);
        }
      });
    },
  ),

  multiSet: jest.fn(
    (keyValuePairs: KeyValuePairs, callback?: Callback): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          keyValuePairs.forEach(([key, value]) => {
            mockStorage[key] = value;
          });
          if (callback) callback(null);
          resolve();
        } catch (error) {
          if (callback) callback(error as Error);
          reject(error);
        }
      });
    },
  ),

  multiRemove: jest.fn((keys: string[], callback?: Callback): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        keys.forEach((key) => delete mockStorage[key]);
        if (callback) callback(null);
        resolve();
      } catch (error) {
        if (callback) callback(error as Error);
        reject(error);
      }
    });
  }),

  mergeItem: jest.fn(
    (key: string, value: string, callback?: Callback): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          mockStorage[key] = value;
          if (callback) callback(null);
          resolve();
        } catch (error) {
          if (callback) callback(error as Error);
          reject(error);
        }
      });
    },
  ),

  flushGetRequests: jest.fn(),
};

export default mockAsyncStorage;
