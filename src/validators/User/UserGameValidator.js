const { body, check, validationResult } = require("express-validator")
const responses = require("../../utilities/responses");




exports.GameValidator = [
    check('chosen_number').isEmail().withMessage('Chosen Number is not valid.').bail(),
    check('iteration_id').notEmpty().withMessage('Please Enter Iteration Id').bail(),
    check('game_id').notEmpty().withMessage('Please enter Game ID.').bail(),
    async (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return responses.validationError(res, err)
        }
        next()
    }
]