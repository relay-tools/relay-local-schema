/* eslint-disable */

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Formats an error response from GraphQL server request.
 */
import formatRequestErrors from './formatRequestErrors';

export default function createRequestError(request, requestType, payload) {
  const error = new Error(
    `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
    `the following reasons:\n\n${formatRequestErrors(request, payload.errors)}`
  );
  error.source = payload;
  return error;
}
