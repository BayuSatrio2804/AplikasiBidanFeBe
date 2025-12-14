/**
 * Async Handler Wrapper
 * Wraps async route handlers to automatically catch errors
 */

/**
 * Wrap async function to catch errors and pass to error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
