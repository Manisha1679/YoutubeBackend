

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack="",
    ){
       super(message);
       this.statusCode=statusCode;
       this.errors=errors;
       this.data=null;
       this.success=false;
       this.message=message;

       if(stack){
         this.stack=stack;
       }else{
         Error.captureStackTrace(this,this.constructor);
       } 

    }
}

export {ApiError}

/*
The ApiError class extends the built-in Error class to provide a structured error response with custom properties like statusCode, message, errors, success, and stack.
It helps standardize error handling across your API and makes debugging easier by including detailed information in each error object.

stack:
The stack in ApiError shows where the error occurred in the code, which is useful for debugging.
If a custom stack trace is not provided, Error.captureStackTrace() automatically generates it using the current location of the error.

Error.captureStackTrace(...) tells JavaScript:
“Generate a clean error trace that shows where this custom error was created.”
 
(this) — the current error object-This tells JavaScript:
"Attach the stack trace to this object"
(meaning: the current instance of ApiError)

(this.constructor) — the class where the error originated-This tells JavaScript:
"Exclude this constructor function (ApiError) from the stack trace"
So the stack trace will start from where the error was thrown, and not show the internal call to ApiError's constructor — making it cleaner and easier to debug.
*/