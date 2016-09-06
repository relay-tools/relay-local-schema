import { graphql } from 'graphql';

import formatRequestErrors from './__forks__/formatRequestErrors';

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
    ).then(({ data, errors }) => {
      if (errors) {
        request.reject(new Error(
          `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
          `the following reasons:\n\n${formatRequestErrors(request, errors)}`
        ));
        if (this.onError) {
          this.onError(errors, request);
        }

        return;
      }

      request.resolve({ response: data });
    });
  }

  supports() {
    return false;
  }
}
