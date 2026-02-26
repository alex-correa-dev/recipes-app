module.exports = {
  presets: ["babel-preset-expo"],
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
