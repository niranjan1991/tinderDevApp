const validateUpdateUserFields = (req) => {
    const ALLOWED_EDIT_FIELDS = ['firstName', 'lastName', 'age', 'skills', 'photoUrl', 'gender'];
    const isAllowed = Object.keys(req.body).every((field) => ALLOWED_EDIT_FIELDS.includes(field));  
    return isAllowed;
};


module.exports = {
    validateUpdateUserFields
};


