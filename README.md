# relay-local-schema
Use [Relay](http://facebook.github.io/relay/) without a GraphQL server.

[![npm version](https://badge.fury.io/js/relay-local-schema.svg)](http://badge.fury.io/js/relay-local-schema)

## Usage

Use `RelayLocalSchema.NetworkLayer` to execute GraphQL queries locally, rather than against a separate GraphQL server. This is intended for experiments, demos, and local development. You should not use this for real applications.

```js
import RelayLocalSchema from 'relay-local-schema';
import schema from './data/schema';

Relay.injectNetworkLayer(new RelayLocalSchema.NetworkLayer({schema}));
```

You can also supply a GraphQL.js `rootValue` or an `onError` callback to the constructor:

```js
Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({
    schema,
    rootValue: "foo",
    onError: (errors, queryString, variables) => {
      console.log(errors, queryString, variables);
    },
  })
);
```
