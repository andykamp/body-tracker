import type { Config } from "jest"

const config: Config = {
  testTimeout: 60000,
  displayName: "common-scraper",
  preset: "../../jest.preset.js",
  testPathIgnorePatterns: [
    "utils.test.ts"
  ],
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": [ "ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/common-scraper"
}

export default config
