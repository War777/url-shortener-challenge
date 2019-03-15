const mongo = require('../../server/mongodb');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UrlSchema = new mongoose.Schema({
  
    url: {
        type: String,
        required: true
    },

    user: mongoose.Schema.Types.ObjectId,

    hash: {
        type: String,
        required: true,
        unique: true
    },

    shorten: {
        type: String,
        required: true,
        unique: true
    },

    isCustom: {
        type: Boolean,
        required: true
    },

    removeToken: {
        type: String,
        required: true
    },

    protocol: String,

    domain: String,
    
    path: String,

    visits: { type: Number, default: 0 },

    createdAt: {
        type: Date,
        default: Date.now
    },

    removedAt: Date,

    active: {
        type: Boolean,
        required: true,
        default: true
    }

});

UrlSchema.plugin(mongoosePaginate);

module.exports = mongo.model('Url', UrlSchema);
