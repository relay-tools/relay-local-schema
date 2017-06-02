# Relay Local Schema [![Travis][build-badge]][build] [![npm][npm-badge]][npm]
Use [Relay](http://facebook.github.io/relay/) without a GraphQL server.

[![Discord][discord-badge]][discord]

## Usage

### Relay Modern

```js
import { Network } from 'relay-local-schema';

import schema from './data/schema';

const environment = new Environment({
  network: Network.create({ schema }),
  /* ... */
});
```

This will execute queries against the specified schema locally, rather than against a separate GraphQL server.

You can also specify a GraphQL.js `rootValue` or `contextValue`:

```js
const environment = new Environment({
  network: Network.create({
    schema,
    rootValue: 'foo',
    contextValue: 'bar',
  }),
  /* ... */
});
```

### Relay Classic

```js
import RelayLocalSchema from 'relay-local-schema/lib/classic';

import schema from './data/schema';

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({ schema })
);
```

This will execute queries against the specified schema locally, rather than against a separate GraphQL server.

You can also supply a GraphQL.js `rootValue` or `contextValue`, or an `onError` callback:

```js
Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({
    schema,
    rootValue: 'foo',
    contextValue: 'bar',
    onError: (errors, request) => console.error(errors, request),
  })
);
```

## Caveat

This is intended for exploratory work, integration tests, demos, and working with local data. This is not generally intended as a substitute for a remote GraphQL back end in production.

[build-badge]: https://img.shields.io/travis/relay-tools/relay-local-schema/master.svg
[build]: https://travis-ci.org/relay-tools/relay-local-schema

[npm-badge]: https://img.shields.io/npm/v/relay-local-schema.svg
[npm]: https://www.npmjs.org/package/relay-local-schema

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bX40xsQ
