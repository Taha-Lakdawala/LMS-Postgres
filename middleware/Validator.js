// Validator functions
const Validators = require('../helper/validatorFunctions')

module.exports = function(validator) {
    // Checking if validator exists or not
    if(!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)

    return async function(req, res, next) {
        try {
            const validated = await Validators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            // Checking if it is validation error
            if(err.isJoi) 
                return res.status(422).send(err.message);
            return res.status(500);
        }
    }
}