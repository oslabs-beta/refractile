OUT=wasm-modules
SRC=wasm-src

$(shell   mkdir -p $(OUT))

fibonacci.js: wasm-src/fibonacci.cpp
	emcc --bind -std=c++11 -o $(OUT)/fibonacci.js $(SRC)/fibonacci.cpp -Os -s MODULARIZE

clean: 
	rm -rf $(OUT); mkdir -p $(OUT);
