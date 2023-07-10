#include <stdio.h>
#include <stdlib.h>

unsigned long long fib(int n)
{
    if (n <= 1)
        return n;
    return fib(n - 1) + fib(n - 2);
}
 
// int main(int argc, char* argv[argc+1])
// {
//     if (argc <= 1) { 
//       printf("You fucked it up!\n"); 
//       return -1;
//     }

//     int arg = atoi(argv[1]);
//     printf("%dth Fibonacci Number: %llu\n", arg, fib(arg));
//     return 0;
// }
