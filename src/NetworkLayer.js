import {graphql} from 'graphql';

import formatRequestErrors from './__forks__/formatRequestErrors';

export default class NetworkLayer {
  constructor({schema, rootValue, onError}) {
    this._schema = schema;
    this._rootValue = rootValue;
    this._onError = onError;
  }

  sendMutation(mutationRequest) {
    if (mutationRequest.getFiles()) {
      throw new Error('uploading files not supported');
    }

    return this._executeRequest('mutation', mutationRequest);
  }

  sendQueries(queryRequests) {
    return Promise.all(queryRequests.map(queryRequest =>
      this._executeRequest('query', queryRequest)
    ));
  }

  async _executeRequest(requestType, request) {
    const {data, errors} = await graphql(
      this._schema,
      request.getQueryString(),
      this._rootValue,
      request.getVariables()
    );

    if (errors) {
      request.reject(new Error(
        `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
        'the following reasons:\n\n' +
        formatRequestErrors(request, errors)
      ));
      if (this._onError) {
        this._onError(errors);
      }
      return;
    }

    request.resolve({response: data});
  }

  supports() {
    return false;
  }
}
