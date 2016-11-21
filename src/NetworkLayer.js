import { graphql } from 'graphql';

import createRequestError from './__forks__/createRequestError';

export default class NetworkLayer {
  constructor({ schema, rootValue, contextValue, onError }) {
    this.schema = schema;
    this.rootValue = rootValue;
    this.context = contextValue;
    this.onError = onError;
  }

  sendMutation(mutationRequest) {
    if (mutationRequest.getFiles()) {
      throw new Error('uploading files not supported');
    }

    return this.executeRequest('mutation', mutationRequest);
  }

  sendQueries(queryRequests) {
    return Promise.all(queryRequests.map(queryRequest =>
      this.executeRequest('query', queryRequest)
    ));
  }

  executeRequest(requestType, request) {
    graphql(
      this.schema,
      request.getQueryString(),
      this.rootValue,
      this.context,
      request.getVariables()
    ).then((payload) => {
      if (payload.errors) {
        request.reject(createRequestError(request, requestType, payload));
        if (this.onError) {
          this.onError(payload.errors, request);
        }

        return;
      }

      request.resolve({ response: payload.data });
    });
  }

  supports() {
    return false;
  }
}
