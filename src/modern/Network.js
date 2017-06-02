import { graphql } from 'graphql';
import { Network as NetworkBase } from 'relay-runtime';

export default {
  create({ schema, rootValue, contextValue }) {
    function fetchQuery(operation, variables) {
      return graphql(
        schema,
        operation.text,
        rootValue,
        contextValue,
        variables,
      ).then((payload) => {
        if (payload.errors) {
          throw new Error(payload.errors);
        }

        return payload;
      });
    }

    return NetworkBase.create(fetchQuery);
  },
};
