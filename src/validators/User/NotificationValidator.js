
exports.LoginValidators = [
    check('web_link').notEmpty().withMessage('Please enter a valid value.').bail(),
    check('app_link').notEmpty().withMessage('Please enter a valid password').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return responses.validationError(res, err)
        }
        next()
    }
]
