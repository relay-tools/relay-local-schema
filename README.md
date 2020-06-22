# Relay Local Schema [![Travis][build-badge]][build] [![npm][npm-badge]][npm]

Use [Relay](https://relay.dev/) without a GraphQL server.

[![Codecov][codecov-badge]][codecov]
[![Discord][discord-badge]][discord]

## Usage

```js
import { Environment } from 'react-relay';
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

For more control over the network layer, you can use `createFetch` to create just the fetch function.

```js
import { Environment, Network } from 'react-relay';
import { createFetch } from 'relay-local-schema';

import schema from './data/schema';

const environment = new Environment({
  network: Network.create(createFetch({ schema })),
  /* ... */
});
```

## Caveat

This is intended for exploratory work, integration tests, demos, and working with local data. This is not generally intended as a substitute for a remote GraphQL back end in production.

[build-badge]: https://img.shields.io/travis/relay-tools/relay-local-schema/master.svg
[build]: https://travis-ci.org/relay-tools/relay-local-schema

[npm-badge]: https://img.shields.io/npm/v/relay-local-schema.svg
[npm]: https://www.npmjs.org/package/relay-local-schema

[codecov-badge]: https://img.shields.io/codecov/c/github/relay-tools/relay-local-schema/master.svg
[codecov]: https://codecov.io/gh/relay-tools/relay-local-schema

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bX40xsQ
