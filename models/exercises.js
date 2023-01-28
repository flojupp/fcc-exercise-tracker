const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userRef : { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: Date
});

let model = mongoose.model('Exercise', schema);

const create = (entity, done) => {
    model.create(entity, (err, doc) => {
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

const find = (id, queryParams, done) => {
    let filter = { userRef: id };
    if (queryParams.from) {
        filter = { ...filter, date: { $gt: new Date(queryParams.from) }};
    }
    if (queryParams.to) {
        filter = { ...filter, date: { $lt: new Date(queryParams.to) }};
    }
    const query = model.find(filter);
    if (queryParams.limit) {
        query.limit(parseInt(queryParams.limit));
    }
    query.exec((err, match) => {
        if (err) done(err);
        done(null, match);
    });
};

exports.create = create;
exports.findById = findById;
exports.find = find;