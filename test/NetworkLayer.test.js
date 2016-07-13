import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import RelayLocalSchema from '../src';

import schema, { resetData } from './fixtures/schema';

describe('NetworkLayer', () => {
  let environment;

  beforeEach(() => {
    environment = new Relay.Environment();
    environment.injectNetworkLayer(
      new RelayLocalSchema.NetworkLayer({ schema })
    );

    resetData();
  });

  describe('query', () => {
    it('should fetch data', done => {
      function Widget({ widget }) {
        return (
          <div>{widget.name}</div>
        );
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
        onReadyStateChange = (readyState) => {
          if (!readyState.done) {
            return;
          }

          expect(ReactDOM.findDOMNode(this).innerHTML).to.equal('foo');
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
          return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
              widget: this.props.widget.id,
            },
          }];
        }

        getVariables() {
          return {
            name: this.props.name,
          };
        }
      }

      class Widget extends React.Component {
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this).innerHTML).to.equal('foo');

          const { relay, widget } = this.props;

          relay.commitUpdate(
            new SetWidgetNameMutation({ widget, name: 'bar' })
          );
        }

        componentDidUpdate() {
          expect(ReactDOM.findDOMNode(this).innerHTML).to.equal('bar');
          done();
        }

        render() {
          return (
            <div>{this.props.widget.name}</div>
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
