// function to send a json object
const respondJSON = (request, response, status, object, type) => {
  // check if it's an xml response
  if (type[0] === 'text/xml') {
    let xmlString = '<response>';
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      xmlString += `<${keys[i]}>${object[keys[i]]}</${keys[i]}>`;
    }
    xmlString += '</response>';
    response.writeHead(status, {
      'Content-Type': 'text/xml',
    });
    response.write(xmlString);
    response.end();
    return;
  }
  // otherwise, respond with JSON
  // set status code and content type (application/json)
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  // stringify the object (so it doesn't use references/pointers/etc)
  // but is instead a flat string object, then write it to the response.
  response.write(JSON.stringify(object));
  // Send the response to the client
  response.end();
};

// function to show a success status code
const success = (request, response, params, contentType) => {
  // message to send
  const responseJSON = {
    message: 'This is a successful response',
  };
    // send our json with a success status code
  respondJSON(request, response, 200, responseJSON, contentType);
};

// function to show a bad request without the correct parameters
const badRequest = (request, response, params, contentType) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respondJSON(request, response, 400, responseJSON, contentType);
  }
  return respondJSON(request, response, 200, responseJSON, contentType);
};

// function to show unauthorized error without the correct parameters
const unauthorized = (request, response, params, contentType) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
    // if the request does not contain a valid=true query parameter
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    // set our error message
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    // give the error a consistent id
    responseJSON.id = 'unauthorized';
    // return our json with a 401 bad request code
    return respondJSON(request, response, 401, responseJSON, contentType);
  }
  return respondJSON(request, response, 200, responseJSON, contentType);
};

// function to show forbidden error
const forbidden = (request, response, params, contentType) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  respondJSON(request, response, 403, responseJSON, contentType);
};

// function to show internal error
const internal = (request, response, params, contentType) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'Internal server error. Something went wrong.',
    id: 'internal',
  };
  respondJSON(request, response, 500, responseJSON, contentType);
};

// function to show not implemented error
const notImplemented = (request, response, params, contentType) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  respondJSON(request, response, 501, responseJSON, contentType);
};

// function to show not found error
const notFound = (request, response, params, contentType) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON, contentType);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
