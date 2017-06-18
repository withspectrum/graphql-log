# `graphql-log`

Add logging to your GraphQL resolvers so you know what's going on in your app.

Everytime a resolver is executed it logs the full path to the resolver. The output in your terminal (when using the popular `debug` module for logging) will be something like this:

```sh
server:resolvers Message.channel +0ms
server:resolvers User.avatar +0ms
server:resolvers User.username +0ms
server:resolvers User.avatar +4ms
server:resolvers User.coverPhoto +0ms
server:resolvers User.username +0ms
```

> Note: The "server:resolvers" and "+xms" parts are added by `debug`, this module only logs the path on execution.

## Usage

This is the simplest example:

```javascript
// Require the module
const createGraphQLLogger = require('graphql-log');

// Create a logger
const logExecutions = createGraphQLLogger();

// Wrap your resolvers
logExecutions(resolvers);
```

Note that **your resolvers need to be a plain object of resolvers**. (like you'd create for `graphql-tools` `makeExecutableSchema` function)

### Options

`graphql-log` has some options:

- `logger` (function, default: `console.log`): Use a custom logger like `debug`, `pino` or any other one.
- `prefix` (string): Prefix all logs with a certain string

```javascript
const logExecutions = createGraphQLLogger({
  // Prefix all logs with resolvers.
  prefix: 'resolvers.',
});
```

#### Usage with custom loggers

Let's say you want to use the popular `debug` module for logging. Doing so would be as easy as passing it into the `logger` option:

```javascript
const debug = require('debug')('server:resolvers');

const logExecutions = createGraphQLLogger({
  logger: debug,
});
```

### Usage only in development

Logging every execution of every resolver will have a performance impact on your app, so we recommend only enabling this module in development. A common way to do so (depending on your setup) would be something like this:

```javascript
const createGraphQLLogger = require('graphql-log');

const resolvers = {/*...*/};

if (process.env.NODE_ENV === 'development') {
  const logExecutions = createGraphQLLogger();
  logExecutions(resolvers);
}
```

## Roadmap

The main thing I want to change is that instead of wrapping the resolvers this module would wrap a finished schema instead. This would make it compatible not only with folks who keep their resolvers separate, but with everybody.

That'd probably look something like this:

```javascript
// I'd love to be able to pass a schema
logExecutions(schema);
```

Good first PR?

## License

Licensed under the MIT License, Copyright ©️ 2017 Maximilian Stoiber. See [LICENSE.md](LICENSE.md) for more information.
