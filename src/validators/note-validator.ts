import { checkSchema } from "express-validator";

export default checkSchema({
    content: {
        errorMessage: "content is missing",
        notEmpty: true,
        trim: true,
    },
    important: {
        optional: true,
        default: false,
    },
});
