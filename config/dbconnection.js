const uri = 'mongodb://localhost:27017/helpdesk';

function conn() {
    var mongoose = require('mongoose');

    mongoose.Promise = global.Promise;
    mongoose
        .connect(uri, { useNewUrlParser: true })
        .then(
            () => { console.log('Database connected'); },
            err => { console.log('Database error - ' + err); }
        );

    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('\nBye...');
            process.exit(0);
        });
    });
}

module.exports = conn;