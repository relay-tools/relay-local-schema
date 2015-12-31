import {
  GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString,
} from 'graphql';
import {
  globalIdField, mutationWithClientMutationId, nodeDefinitions,
} from 'graphql-relay';

const widget = {
  id: '',
};

export function resetData() {
  widget.name = 'foo';
}

/* eslint-disable no-use-before-define */
const { nodeInterface, nodeField } = nodeDefinitions(
  () => widget, () => Widget
);
/* eslint-enable */

const Widget = new GraphQLObjectType({
  name: 'Widget',
  fields: {
    id: globalIdField(),
    name: {
      type: GraphQLString,
    },
  },
  interfaces: [nodeInterface],
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    widget: {
      type: Widget,
      resolve: () => widget,
    },
  },
});

const SetWidgetName = mutationWithClientMutationId({
  name: 'SetWidgetName',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    widget: {
      type: Widget,
      resolve: () => widget,
    },
  },
  mutateAndGetPayload: ({ name }) => {
    widget.name = name;
    return {};
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    setWidgetName: SetWidgetName,
  },
});

export default new GraphQLSchema({ query, mutation });
