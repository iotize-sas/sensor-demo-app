const debugFactory = require("debug");

export default function getDebugger(key: string) {
  return debugFactory(`:${key}`);
}
