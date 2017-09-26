const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDB');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Fail to insert', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    // Users (name, age, location)
    db.collection('Users').insertOne({
        name: 'Andrew Mead',
        age: 25,
        location: 'USA'
    }, (err, result) => {
        if (err) {
            return console.log('Failed to insert user', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});