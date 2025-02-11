import { checkSchema } from "express-validator";

export default checkSchema({
    content: {
        optional: true,
        errorMessage: "content is missing",
        notEmpty: {
            errorMessage: "content cannot be empty",
        },
        trim: true,
    },
    important: {
        optional: true,
        isBoolean: {
            errorMessage: "important must be a boolean value",
        },
        toBoolean: true,
    },
});
