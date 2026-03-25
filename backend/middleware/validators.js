import Joi from 'joi';

const tenderSchema = Joi.object({
    tender_notice_no: Joi.string().required(),
    name_of_work: Joi.string().min(10).required(),
    estimate_amount: Joi.number().optional().default(0),
    submission_date: Joi.date().required(),
    sale_start_date: Joi.date().required(),
    sale_end_date: Joi.date().greater(Joi.ref('sale_start_date')).required(),
    // ... add other fields here
});

export const validateTender = (req, res, next) => {
    const { error } = tenderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};