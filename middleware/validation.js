const {
    body,
    validationResult
} = require('express-validator');

exports.signUpValidationRules = () => {
    return [
        // username must be an email
        body("firstName").notEmpty().isLength({
            min: 3
        }).isAlpha().trim().escape().withMessage("Name must have more than 3 characters"),
        body("lastName").notEmpty().isLength({
            min: 3
        }).isAlpha().trim().escape().withMessage("Name must have more than 3 characters"),
        body("email").notEmpty().isEmail().normalizeEmail().withMessage("Email is required"),
        body("password").notEmpty().isLength({
            min: 5
        }).withMessage("Password must have at least 5 characters"),
        body("jobRole").notEmpty().isAlpha(),
        body("gender").notEmpty(),
        body("department").notEmpty(),
        body("address").notEmpty()
    ]
}

exports.signInValidationRules = () => {
    return [
        body("email").notEmpty().isEmail().normalizeEmail().withMessage("Email is required"),
        body("password").notEmpty()
    ]
}

exports.postGifsRules = () => {
    return [
        body("gif_url").notEmpty().withMessage("Gif is required"),
        body("title").notEmpty().withMessage("title must not be empty"),
    ]
}

exports.postArticlesRules = () => {
    return [
        body("article").notEmpty().withMessage("Article is required"),
        body("title").notEmpty().withMessage("title must not be empty"),
    ]
}

exports.postCommentRules = () => {
    return [
        body("comment").notEmpty().withMessage("comment is required"),
    ]
}

exports.updateArticleRules = () => {
    return [
        body("article").notEmpty().withMessage("Article is required"),
    ]
}

exports.validation = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({
            [err.param]: err.msg
        }))

        return res.status(422).json({
            errors: extractedErrors,
        })

    } catch {
        res.status(401).json({
            error: "Unauthorized",
            status: "error"
        })
    }
}