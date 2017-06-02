import { Environment, fetchQuery, graphql, RecordSource, Store }
  from 'relay-runtime';

import { Network } from '../../src';

import schema, { resetData } from '../fixtures/schema';

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
    it('should fetch data', () => (
      expect(fetchQuery(
        environment,
        graphql`
          query Network_test_query_fetch_data_Query {
            widget {
              name
            }
          }
        `,
      )).resolves.toEqual({
        widget: {
          name: 'foo',
        },
      })
    ));

    it('should fail', () => (
      expect(fetchQuery(
        environment,
        graphql`
          query Network_test_query_fail_Query {
            invalid {
              name
            }
          }
        `,
      )).rejects.toBeDefined()
    ));
  });

  describe('mutation', () => {
    it('should execute mutations', () => (
      expect(fetchQuery(
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
      )).resolves.toEqual({
        setWidgetName: {
          widget: {
            name: 'bar',
          },
        },
      })
    ));
  });
});
