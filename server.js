var app = require('./config/express');
require('./config/dbconnection')();

app.listen(process.env.PORT || 5000, function() {
    console.log('Server running');
});