module.exports = {
  presets: ["babel-preset-expo", "@babel/preset-typescript"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./",
          "@components": "./components",
          "@hooks": "./hooks",
          "@services": "./services",
          "@utils": "./utils",
          "@types": "./types",
          "@assets": "./assets",
        },
      },
    ],
  ],
};
