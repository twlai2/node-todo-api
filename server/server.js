require('./config/config');

const { ObjectID } = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id,
    }).then(todos => {
        res.send({ todos });
    }).catch(err => {
        res.status(400).send(err);
    })
});

app.get('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Todo.findById(id).then(todo => {
    Todo.findOne({
        _id: id,
        _creator: req.user._id,
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        return res.status(200).send({ todo });
    }).catch(e => {
        return res.status(400).send();
    })
});

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });
    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Todo.findByIdAndRemove(id).then(todo => {
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user.id,
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch(error => {
        res.status(400).send();
    })
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
    // Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch(todo => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send({ user });
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    User.findByCredentials(email, password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(() => {
        res.status(401).send();
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })  
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}
