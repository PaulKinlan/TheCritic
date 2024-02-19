// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

console.log("In here");

export default {
  input: "index.ts",
  output: {
    dir: "../dist/ui/",
    format: "esm",
  },
  plugins: [typescript(), nodeResolve(), json(), commonjs()],
};
