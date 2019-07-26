function logger2(request, response, next) {
  const ingo = `${request.method} ${request.path} |`;
}

function logger(request, reponse, next) {
  console.log('A request was made');
  next();
}
module.exports = logger;
