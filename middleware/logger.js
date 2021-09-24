function loggerMiddleware(req,res,next){
    console.log(`Logger ${req.url} - ${req.method} -- ${ new Date() }`);
    next();
}

function loggerError(req,res,next){

    if( res.statusMessage === "OK" && res.statusCode === 200){
        console.log(`Loggeado ${res.statusMessage} --- ${res.statusCode} / ${ new Date() }`.green);
    };

    if( res.statusMessage === "Not Found" && res.statusCode === 404){
        console.log(`Loggeado ${res.statusMessage} --- ${res.statusCode} / ${ new Date() }`.underline.red);
    };

    if( res.statusMessage === "Created" && res.statusCode === 201){
        console.log(`Loggeado ${res.statusMessage} --- ${res.statusCode} / ${ new Date() }`.inverse.blue);
    };
    
    next();
};

module.exports = { loggerMiddleware, loggerError };