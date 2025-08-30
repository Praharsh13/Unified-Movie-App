// It wraps an asynchronous function (f) and ensures that if an error occurs during its execution,
// the error will be caught and handled properly.
// This helps avoid the need to write repetitive try/catch
// blocks in every route handler.



const asyncHandler= (f)=>(req,res,next)=>{
    Promise.resolve(f(req,res,next)).catch((error)=>{
        res.status(500).json({message:error.message})
    })
}

export default asyncHandler