import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Relay from 'react-relay/classic';

import RelayLocalSchema from '../../src/classic';

import schema, { resetData } from '../fixtures/schema';

describe('NetworkLayer', () => {
  let environment;

  beforeEach(() => {
    environment = new Relay.Environment();
    environment.injectNetworkLayer(
      new RelayLocalSchema.NetworkLayer({ schema }),
    );

    resetData();
  });

  describe('query', () => {
    it('should fetch data', done => {
      function Widget({ widget }) {
        return <div>{widget.name}</div>;
      }

      const WidgetContainer = Relay.createContainer(Widget, {
        fragments: {
          widget: () => Relay.QL`
            fragment on Widget {
              name
            }
          `,
        },
      });

      const widgetQueryConfig = {
        name: 'WidgetQueryConfig',
        queries: {
          widget: () => Relay.QL`query { widget }`,
        },
        params: {},
      };

      class Component extends React.Component {
        onReadyStateChange = readyState => {
          if (!readyState.done) {
            return;
          }

          expect(ReactDOM.findDOMNode(this).innerHTML).toBe('foo'); // eslint-disable-line react/no-find-dom-node
          done();
        };

        render() {
          return (
            <Relay.Renderer
              Container={WidgetContainer}
              queryConfig={widgetQueryConfig}
              environment={environment}
              onReadyStateChange={this.onReadyStateChange}
            />
          );
        }
      }

      ReactTestUtils.renderIntoDocument(<Component />);
    });

    it('should fail', done => {
      function Widget() {
        return <div />;
      }

      const WidgetContainer = Relay.createContainer(Widget, {
        fragments: {
          widget: () => Relay.QL`
            fragment on Widget {
              name
            }
          `,
        },
      });

      const widgetQueryConfig = {
        name: 'WidgetQueryConfig',
        queries: {
          widget: () => Relay.QL`query { invalid }`,
        },
        params: {},
      };

      ReactTestUtils.renderIntoDocument(
        <Relay.Renderer
          Container={WidgetContainer}
          queryConfig={widgetQueryConfig}
          environment={environment}
          render={({ error }) => {
            if (error) {
              expect(error.source.errors[0].message).toBe('Always fail');
              done();
            }
          }}
        />,
      );
    });
  });

  describe('mutation', () => {
    it('should execute mutations', done => {
      class SetWidgetNameMutation extends Relay.Mutation {
        static fragments = {
          widget: () => Relay.QL`
            fragment on Widget {
              id
            }
          `,
        };

        getMutation() {
          return Relay.QL`mutation { setWidgetName }`;
        }

        getFatQuery() {
          return Relay.QL`
            fragment on SetWidgetNamePayload {
              widget {
                name
              }
            }
          `;
        }

        getConfigs() {
          return [
            {
              type: 'FIELDS_CHANGE',
              fieldIDs: {
                widget: this.props.widget.id,
              },
            },
          ];
        }

        getVariables() {
          return {
            name: this.props.name,
          };
        }
      }

      class Widget extends React.Component {
        componentDidMount() {
          expect(this.node.innerHTML).toBe('foo');

          const { relay, widget } = this.props;

          relay.commitUpdate(
            new SetWidgetNameMutation({ widget, name: 'bar' }),
          );
        }

        componentDidUpdate() {
          expect(this.node.innerHTML).toBe('bar');
          done();
        }

        render() {
          return (
            <div
              ref={c => {
                this.node = c;
              }}
            >
              {this.props.widget.name}
            </div>
          );
        }
      }

      const WidgetContainer = Relay.createContainer(Widget, {
        fragments: {
          widget: () => Relay.QL`
            fragment on Widget {
              name
              ${SetWidgetNameMutation.getFragment('widget')}
            }
          `,
        },
      });

      const widgetQueryConfig = {
        name: 'WidgetQueryConfig',
        queries: {
          widget: () => Relay.QL`query { widget }`,
        },
        params: {},
      };

      function Component() {
        return (
          <Relay.Renderer
            Container={WidgetContainer}
            queryConfig={widgetQueryConfig}
            environment={environment}
          />
        );
      }

      ReactTestUtils.renderIntoDocument(<Component />);
    });
  });
});
