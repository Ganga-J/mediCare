const Joi = require('joi');

// Schema for MediBridge user validation
const mediBridgeUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name must be less than or equal to 30 characters'
    }),
    url: Joi.string().uri().required().messages({
        'string.empty': 'URL is required',
        'string.uri': 'URL must be a valid URI'
    }),
    apiKey: Joi.string().alphanum().min(10).max(50).required().messages({
        'string.empty': 'API key is required',
        'string.alphanum': 'API key must contain only alphanumeric characters',
        'string.min': 'API key must be at least 10 characters',
        'string.max': 'API key must be less than or equal to 50 characters'
    })
});

// Generic middleware factory for validation
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            return res.status(400).json({ errors: messages });
        }
        next();
    };
};

// Specific middleware for MediBridge user validation
const validateMediBridgeUser = validate(mediBridgeUserSchema);

module.exports = { validateMediBridgeUser, validate };