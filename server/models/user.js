// imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//  generate schema
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    company: {type: String, required: true},
    role: {type: String, required: true},
    active: {type: Boolean,}
});

userSchema.plugin(uniqueValidator);

// export
module.exports = mongoose.model('User', userSchema);