const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User} = require('../models/signUpModel')
const Joi = require("joi");


router.post('/', async(request,response) => {
    try {
		const { error } = validateSignIn(request.body);
		if (error)
			return response.status(400).send({ message: error.details[0].message });
		
		const user = await User.findOne({ email: request.body.email });
		if (!user)
			return response.status(401).send({ message: "Invalid Email or Password" });
		
		const validPassword = await bcrypt.compare(
			request.body.password,
			user.password
		);
		if (!validPassword)
			return response.status(401).send({ message: "Invalid Email or Password" });

		//const token = user.generateAuthToken();
		response.status(200).send({ message: "logged in successfully" });
	} catch (error) {
		response.status(500).send({ message: "Internal Server Error" });
	}
});

const validateSignIn = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;