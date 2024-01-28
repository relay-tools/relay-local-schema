import { graphql } from 'graphql';

export default function createFetch({ schema, rootValue, contextValue }) {
  return function fetchQuery(operation, variableValues) {
    return graphql({
      schema,
      source: operation.text,
      rootValue,
      contextValue,
      variableValues,
    }).then((payload) => {
      if (payload.errors) {
        throw new Error(payload.errors.join('\n'));
      }

      return payload;
    });
  };
}
