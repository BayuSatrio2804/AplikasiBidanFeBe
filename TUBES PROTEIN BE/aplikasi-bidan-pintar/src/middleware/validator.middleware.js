const validator = (schema) => (req, res, next) => {
    // Log request body untuk debugging
    console.log('[VALIDATOR DEBUG] Request Body:', JSON.stringify(req.body, null, 2));
    
    // Jalankan validasi, mengumpulkan semua error (abortEarly: false)
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // Format error agar sesuai dengan API Spec (HTTP 400 Bad Request)
        const errorMessages = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));

        console.log('[VALIDATOR ERROR]', errorMessages);

        return res.status(400).json({
            message: 'Validasi input gagal',
            errors: errorMessages
        });
    }
    next();
};

module.exports = validator;