const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB', err);
    }

    // db.collection('Todos').find({ 
    //     _id: new ObjectID('59c8cc2c2a2a5c9564029749')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log(err);
    // })

    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos count:', count);
    // }, (err) => {
    //     console.log(err);
    // })

    db.collection('Users').find({ name: 'Andrew' }).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log(err);
    })
});