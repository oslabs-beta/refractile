module.exports = {
  preload_cmds: ['bash -c "mkdir -p wasm-modules"'],
  modules: {
    fibonacci: {
      bin: './wasm-modules/',
      make: 'make',
      src: './wasm-src/fibonacci.cpp',
    },
  },
};
