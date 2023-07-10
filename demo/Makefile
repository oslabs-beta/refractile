OUT=wasm-modules
SRC=wasm-src

$(shell   mkdir -p $(OUT))

fibonacci.js, fibonacci.wasm: wasm-src/fibonacci.c
	emcc -o $(OUT)/fibonacci.js $(SRC)/fibonacci.c -Os -s MODULARIZE
