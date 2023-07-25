OUT=wasm-modules
SRC=wasm-src

fibonacci.js: wasm-src/fibonacci.cpp
	emcc --bind -std=c++11 -o $(OUT)/fibonacci.js $(SRC)/fibonacci.cpp -Os -s MODULARIZE
