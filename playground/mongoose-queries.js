const { ObjectID } = require('mongodb')
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '59c9fc260a0a5d7b002f985e';

// 1. query work, but no user
// 2. user was found, print the user
// 3. handle any error that may have occurred
User.findById(id).then(user => {
    if (!user) {
        return console.log('User not found')
    }
    return console.log(JSON.stringify(user, undefined, 2));
}).catch(e => {
    console.log(e);
});

// const id = '59cb0330e2c7a269f8323f3a11';

// if (!ObjectID.isValid(id)) {
//     return console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then(todos => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then(todo => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch(e => console.log(e));
