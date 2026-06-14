const mongoose = require('mongoose');
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI
const Schema = mongoose.Schema;

mongoose.connect(MONGO_URI);

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});
const NoteSchema = new Schema({
    title: String,
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});
const PhotoSchema = new Schema({
    url: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});
const UserModel = mongoose.model('User', UserSchema);
const NoteModel = mongoose.model('Note', NoteSchema);
const PhotoModel = mongoose.model('Photo', PhotoSchema);

module.exports = { UserModel, NoteModel, PhotoModel };