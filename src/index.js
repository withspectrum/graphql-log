// @flow
const deepForEach = require('deep-for-each');
const isFunction = require('is-function');
import {
  getNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  responsePathAsArray,
  type GraphQLField,
  type GraphQLFieldResolver,
} from 'graphql';

type Options = {
  logger?: Function,
  prefix?: string,
};

function wrap(
  field: GraphQLField<*, *>,
  injectedFn: (path: string) => void,
  prefix: string = ''
): void {
  // TODO handle field with no resolve fn ?
  const resolveFn = field.resolve;

  if (resolveFn)
    field.resolve = (...args) => {
      injectedFn(prefix + responsePathAsArray(args[3].path).join('.'));
      return resolveFn(...args);
    };
}

const createGraphQLLogger = (options?: Options = {}) => (input: Object) => {
  const logger = options.logger || console.log.bind(console);

  if (input instanceof GraphQLSchema) {
    forEachField(input, field => wrap(field, logger, options.prefix));
  }

  // Deeply iterate over all resolvers
  deepForEach(input, (value, prop, subject, path) => {
    // If we have a function
    if (isFunction(value)) {
      // Construct the string to be logged
      const string = options.prefix ? options.prefix + path : path;
      // Replace the original value with a wrapper function
      subject[prop] = function wrapped(...args) {
        logger(string);
        return value(...args);
      };
    }
  });
};

// https://github.com/apollographql/graphql-tools/blob/513108b1a6928730e347191527cba07d68aadb74/src/generate/forEachField.ts
function forEachField(
  schema: GraphQLSchema,
  fn: (
    fieldDef: GraphQLField<any, any>,
    typeName: string,
    fieldName: string
  ) => void
): void {
  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];

    if (
      !getNamedType(type).name.startsWith('__') &&
      type instanceof GraphQLObjectType
    ) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        field;
        fn(field, typeName, fieldName);
      });
    }
  });
}

module.exports = createGraphQLLogger;
