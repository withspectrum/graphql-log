// @flow
import createGraphQLLogger from '../';

describe('createGraphQLLogger', () => {
  it('should return a function', () => {
    const result = createGraphQLLogger();
    expect(result).toBeInstanceOf(Function);
  });
});

describe('logger', () => {
  describe('replacer', () => {
    it('should wrap each function in an object', () => {
      const logExecutions = createGraphQLLogger();
      const key = 'test';
      const key2 = 'test2';
      const value = () => {};
      const obj = {
        [key]: value,
        [key2]: value,
      };

      expect(obj[key]).toEqual(value);
      expect(obj[key2]).toEqual(value);
      logger(obj);
      expect(obj[key].name).toEqual('wrapped');
      expect(obj[key]).not.toEqual(value);
      expect(obj[key2].name).toEqual('wrapped');
      expect(obj[key2]).not.toEqual(value);
    });

    it('should wrap nested functions in an object', () => {
      const logExecutions = createGraphQLLogger();
      const nester = 'nested';
      const key = 'test';
      const key2 = 'test2';
      const value = () => {};
      const obj = {
        [nester]: {
          [key]: value,
          [key2]: value,
        },
      };

      expect(obj[nester][key]).toEqual(value);
      expect(obj[nester][key2]).toEqual(value);
      logger(obj);
      expect(obj[nester][key].name).toEqual('wrapped');
      expect(obj[nester][key]).not.toEqual(value);
      expect(obj[nester][key2].name).toEqual('wrapped');
      expect(obj[nester][key2]).not.toEqual(value);
    });

    it('should leave all non-function values alone', () => {
      const logExecutions = createGraphQLLogger();
      const key = 'test';
      const key2 = 'test2';
      const value = () => {};
      const value2 = 'string';
      const obj = {
        [key]: value,
        [key2]: value2,
      };

      expect(obj[key]).toEqual(value);
      expect(obj[key2]).toEqual(value2);
      logger(obj);
      expect(obj[key].name).toEqual('wrapped');
      expect(obj[key]).not.toEqual(value);
      expect(obj[key2]).not.toBeInstanceOf(Function);
      expect(obj[key2]).toEqual(value2);
    });
  });

  describe('wrapper', () => {
    it('should call logger with the path of the object when a wrapped function is called', () => {
      const spy = jest.fn();
      const logger = createGraphQLLogger({
        logger: spy,
      });
      const key = 'test';
      const value = () => {};
      const obj = {
        [key]: value,
      };

      logger(obj);
      expect(obj[key]).toBeInstanceOf(Function);
      obj[key]();
      expect(spy).toHaveBeenCalledWith(key);
    });

    it('should call logger with the nested path of the object', () => {
      const spy = jest.fn();
      const logger = createGraphQLLogger({
        logger: spy,
      });
      const nester = 'nested';
      const key = 'test';
      const value = () => {};
      const obj = {
        [nester]: {
          [key]: value,
        },
      };

      logger(obj);
      expect(obj[nester][key]).toBeInstanceOf(Function);
      obj[nester][key]();
      expect(spy).toHaveBeenCalledWith(`${nester}.${key}`);
    });

    it('should call the wrapped function with all arguments passed through', () => {
      const logger = createGraphQLLogger({
        // Pass mock logger to not output everything in the console
        logger: jest.fn(),
      });
      const key = 'test';
      const value = jest.fn();
      const obj = {
        [key]: value,
      };

      const args = ['some', 'arguments'];
      logger(obj);
      expect(obj[key]).toBeInstanceOf(Function);
      obj[key](...args);
      expect(value).toHaveBeenCalledWith(...args);
    });
  });

  describe('options', () => {
    it('should use the console as the default logger', () => {
      const log = console.log.bind(console);
      console.log = jest.fn();
      const logExecutions = createGraphQLLogger();
      const key = 'test';
      const value = () => {};
      const obj = {
        [key]: value,
      };

      logger(obj);
      obj[key]();
      expect(console.log).toHaveBeenCalled();
      console.log = log;
    });

    it('should allow custom loggers', () => {
      const spy = jest.fn();
      const logger = createGraphQLLogger({
        logger: spy,
      });
      const key = 'test';
      const value = () => {};
      const obj = {
        [key]: value,
      };

      logger(obj);
      obj[key]();
      expect(spy).toHaveBeenCalled();
    });

    it('should prefix all logs with the prefix', () => {
      const spy = jest.fn();
      const prefix = 'test';
      const logger = createGraphQLLogger({
        logger: spy,
        prefix,
      });
      const key = 'test';
      const value = () => {};
      const obj = {
        [key]: value,
      };

      logger(obj);
      obj[key]();
      expect(spy).toHaveBeenCalledWith(prefix + key);
    });
  });
});
