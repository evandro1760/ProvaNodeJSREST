var mongoose = require('mongoose');

var schema = mongoose.Schema({
    opened_by: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['OPENED', 'CLOSED'],
        default: 'OPENED'
    },
    closed: {
        by: String,
        worked_minutes: Number
    }
});

mongoose.model('Request', schema);