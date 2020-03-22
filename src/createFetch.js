import { graphql } from 'graphql';

export default function createFetch({ schema, rootValue, contextValue }) {
  return function fetchQuery(operation, variables) {
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
  };
}
