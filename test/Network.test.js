import { Environment, graphql, RecordSource, Store } from 'relay-runtime';

import { Network } from '../src';

import schema, { resetData } from './fixtures/schema';

function executeQuery(environment, taggedNode) {
  const {
    getRequest,
    createOperationDescriptor,
  } = environment.unstable_internal;

  const query = getRequest(taggedNode);
  const operation = createOperationDescriptor(query);

  return environment
    .execute({ operation })
    .map(() => environment.lookup(operation.fragment).data)
    .toPromise();
}

describe('Network', () => {
  let environment;

  beforeEach(() => {
    environment = new Environment({
      network: Network.create({ schema }),
      store: new Store(new RecordSource()),
    });

    resetData();
  });

  describe('query', () => {
    it('should fetch data', () =>
      expect(
        executeQuery(
          environment,
          graphql`
            query Network_test_query_fetch_data_Query {
              widget {
                name
              }
            }
          `,
        ),
      ).resolves.toEqual({
        widget: {
          name: 'foo',
        },
      }));

    it('should fail', () =>
      expect(
        executeQuery(
          environment,
          graphql`
            query Network_test_query_fail_Query {
              invalid {
                name
              }
            }
          `,
        ),
      ).rejects.toThrow());
  });

  describe('mutation', () => {
    it('should execute mutations', () =>
      expect(
        executeQuery(
          environment,
          graphql`
            mutation Network_test_mutation_execute_mutations_Mutation {
              setWidgetName(input: { name: "bar" }) {
                widget {
                  name
                }
              }
            }
          `,
        ),
      ).resolves.toEqual({
        setWidgetName: {
          widget: {
            name: 'bar',
          },
        },
      }));
  });
});
