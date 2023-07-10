#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
unsigned long long fibonacci(int n)
{
    if (n <= 1)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}