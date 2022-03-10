const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User} = require('../models/signUpModel')
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

router.post('/', async (request,response) => {
    const { error } = validateSignUp(request.body);
		if (error)
            return response.status(400).send({ message: error.details[0].message });
    
    const user = await User.findOne({ email: request.body.email });
		if (user)
			return response
				.status(409)
				.send({ message: "User with given email already Exist!" });

    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(request.body.password,saltPassword)


    await new User({ ...request.body, password: securePassword }).save()
    .then(data => {
        response.json(data)
    })
    .catch(error => {
        response.json(error)
    })
})

const validateSignUp = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;