import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

config.globals = {
  "ts-jest": {
    tsconfig: "<rootDir>/test/tsconfig.json",
  },
};

export default config;
