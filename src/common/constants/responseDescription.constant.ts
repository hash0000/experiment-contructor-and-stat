const responseDescriptionConstant = {
  SUCCESS: 'All good.',
  UNPROCESSABLE_ENTITY: 'Validation error. Check the error code.',
  FORBIDDEN: 'Access denied or data not found.',
  UNAUTHORIZED: 'Invalid token.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  ACCEPTED_CREDENTIALS: 'Accepted credentials, but account not verified',
  CONFLICT: 'Data conflict',
  TOO_MANY_REQUESTS: 'Wait before retrying the request',
  NOT_FOUND: 'The specified data was not found',
  BAD_REQUEST: 'Wrong data',
};

export default responseDescriptionConstant;
