module.exports = {
  mount: {
    public: "/",
    snowpack: "/snowpack",
    "src/popup": "/popup",
    "src/content": "/content",
    "src/background": "/background",
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
  ],
  installOptions: {
    namedExports: ["antd", "@ant-design/icons", "react-redux"],
  },
  buildOptions: {
    metaDir: "snowpack",
  },
};
