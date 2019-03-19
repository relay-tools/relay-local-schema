import { Network } from 'relay-runtime';

import createFetch from './createFetch';

export default {
  create(options) {
    return Network.create(createFetch(options));
  },
};
