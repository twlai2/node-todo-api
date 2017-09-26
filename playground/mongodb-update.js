const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to DB', err);
    }
    console.log('Connected to DB');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59c9afef2823b2a14aba30b4')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(result => {
    //     console.log(result)
    // })
    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59c8cc8f8896529688913a53')
    }, {
        $set: {
            name: 'John'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then(doc => {
        console.log(doc)
    });
})