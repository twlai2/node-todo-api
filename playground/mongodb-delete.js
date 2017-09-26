const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    // db.collection('Todos').deleteMany({ text: 'Walk the AA' }).then((result) => {
    //     console.log(result);
    // })

    // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then(result => {
    //     console.log(result);
    // })

    // db.collection('Todos').findOneAndDelete({ completed: false }).then(doc => {
    //     console.log(doc)
    // })

    // db.collection('Users').deleteMany({ name: 'Andrew' }).then(result => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndDelete({ _id: new ObjectID('59c9acb62823b2a14aba300c') }).then(doc => {
        console.log(doc);
    })
});
