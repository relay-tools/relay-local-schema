# relay-local-schema [![Travis][build-badge]][build] [![npm][npm-badge]][npm]
Use [Relay](http://facebook.github.io/relay/) without a GraphQL server.

[![Discord][discord-badge]][discord]

## Usage

Use `RelayLocalSchema.NetworkLayer` to execute GraphQL queries locally, rather than against a separate GraphQL server.

This is intended for exploratory work, integration tests, demos, and working with local data. This is not generally intended as a substitute for a remote backend, except possibly when using local data as a persistent cache.

```js
import RelayLocalSchema from 'relay-local-schema';

import schema from './data/schema';

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({ schema })
);
```

You can also supply a GraphQL.js `rootValue` or an `onError` callback to the
constructor:

```js
Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({
    schema,
    rootValue: 'foo',
    onError: (errors, request) => console.error(errors, request),
  })
);
```

[build-badge]: https://img.shields.io/travis/relay-tools/relay-local-schema/master.svg
[build]: https://travis-ci.org/relay-tools/relay-local-schema

[npm-badge]: https://img.shields.io/npm/v/relay-local-schema.svg
[npm]: https://www.npmjs.org/package/relay-local-schema

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bX40xsQ
