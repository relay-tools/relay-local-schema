import formatRequestErrors from './formatRequestErrors';

export default function createRequestError(request, requestType, payload) {
  const error = new Error(
    `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
    `the following reasons:\n\n${formatRequestErrors(request, payload.errors)}`
  );
  error.source = payload;
  return error;
}
