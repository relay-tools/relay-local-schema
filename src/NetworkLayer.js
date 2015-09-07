import {graphql} from 'graphql';

import formatRequestErrors from './__forks__/formatRequestErrors';

export default class NetworkLayer {
  constructor({schema, rootValue}) {
    this._schema = schema;
    this._rootValue = rootValue;
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
    const result = await graphql(
      this._schema,
      request.getQueryString(),
      this._rootValue,
      request.getVariables()
    );

    if (result.errors) {
      request.reject(new Error(
        `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
        'the following reasons:\n\n' +
        formatRequestErrors(request, result.errors)
      ));
      return;
    }

    request.resolve({response: result.data});
  }

  supports() {
    return false;
  }
}
