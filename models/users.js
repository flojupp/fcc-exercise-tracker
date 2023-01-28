const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username : { type: String, required: true }
});

let model = mongoose.model('User', schema);

const create = (userName, done) => {
    model.create({ username: userName }, (err, doc) => {
        if (err) done(err);
        done(null, doc);
    });
};

const findById = (id, done) => {
    model.findById(id, (err, match) => {
        if (err) done(err);
        done(null, match);
    });
};

const findAll = (done) => {
    model.find({}, (err, matches) => {
        if (err) done(err);
        done(null, matches);
    })
};

exports.create = create;
exports.findById = findById;
exports.findAll = findAll;