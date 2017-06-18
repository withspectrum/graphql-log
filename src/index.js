// @flow
const deepForEach = require('deep-for-each');
const isFunction = require('is-function');

type Options = {
  logger?: Function,
  prefix?: string,
};

const createGraphQLLogger = (options?: Options = {}) => (resolvers: Object) => {
  const logger = options.logger || console.log.bind(console);
  // Deeply iterate over all resolvers
  deepForEach(resolvers, (value, prop, subject, path) => {
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

module.exports = createGraphQLLogger;
