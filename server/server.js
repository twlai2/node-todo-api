const { ObjectID } = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({ todos });
    }).catch(err => {
        res.status(400).send(err);
    })
});

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        return res.status(200).send({ todo });
    }).catch(e => {
        return res.status(400).send();
    })
});

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch(error => {
        res.status(400).send();
    })
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {
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

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}
