const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  // parse the url, grab any section of the URL by name
  const parsedUrl = url.parse(request.url);
  // grab params (?key=value&key2=value2&etc=etc) and parse
  const params = query.parse(parsedUrl.query);
  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  // grab the 'accept' headers (comma delimited) and split them into an array
  const contentType = request.headers.accept.split(',');
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params, contentType);
  } else {
    urlStruct.notFound(request, response, params, contentType);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
