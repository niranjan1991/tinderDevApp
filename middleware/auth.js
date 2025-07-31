
const authToken = '123ABCD';

const isUserAuthenticated = (req, res, next) => {
    if (authToken !== '123ABC') {
        return res.status(401).send({ returnCode: 1, message: 'Unauthorized user' });
    } else {
        next();
    }
};


const isAdminAuthenticated = (req, res, next) => {
    if (authToken !== '123ABC') {
        return res.status(401).send({ returnCode: 1, message: 'Unauthorized admin' });
    } else {
        next();
    }
};

module.exports = {
    isUserAuthenticated,
    isAdminAuthenticated
};