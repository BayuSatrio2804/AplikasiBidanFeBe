/**
 * Request Validation Middleware
 * Uses Joi schemas for input validation
 */

const { validationError } = require('../utils/response');

/**
 * Validate request body against Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context?.key || 'unknown',
      message: detail.message.replace(/"/g, '')
    }));
    
    console.error('[VALIDATION_ERROR] Request body:', JSON.stringify(req.body, null, 2));
    console.error('[VALIDATION_ERROR] Validation errors:', JSON.stringify(errors, null, 2));

    return validationError(res, errors);
  }

  // Replace body with validated/sanitized value
  req.body = value;
  next();
};

/**
 * Validate request query parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context?.key || 'unknown',
      message: detail.message.replace(/"/g, '')
    }));

    return validationError(res, errors);
  }

  req.query = value;
  next();
};

/**
 * Validate request params
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context?.key || 'unknown',
      message: detail.message.replace(/"/g, '')
    }));

    return validationError(res, errors);
  }

  req.params = value;
  next();
};

// Default export for backward compatibility
module.exports = validateBody;

// Named exports
module.exports.validateBody = validateBody;
module.exports.validateQuery = validateQuery;
module.exports.validateParams = validateParams;