function logger2(request, response, next) {
  const ingo = `${request.method} ${request.path} |`;
}

function logger(request, reponse, next) {
  next();
}
module.exports = logger;
