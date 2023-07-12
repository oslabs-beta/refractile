#include <emscripten/bind.h>

using namespace emscripten;

typedef struct Params { 
    int value;
} Params;

typedef struct Request { 
     Params params;
} Request;

typedef struct Response { 
    val locals;
} Response;

double fibFunc (double n) { 
    if (n <= 1) return n; 
    return fibFunc(n - 1) + fibFunc(n - 2);
}

void fibonacci (Request req, Response res, val next) { 
    res.locals.set("result", fibFunc(req.params.value));
    next();
}

EMSCRIPTEN_BINDINGS(fibonacci_middleware) { 
    value_object<Params>("Params")
    .field("value", &Params::value);

    value_object<Request>("Request")
    .field("params", &Request::params);

    value_object<Response>("Response")
    .field("locals", &Response::locals);

    function("fibonacci", fibonacci);
}
