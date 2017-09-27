const { ObjectID } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
// const { User } = require('../models/user');

const todos = [
    { 
        _id: new ObjectID(),
        text: 'First test todo' 
    },
    { 
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 333
    }
];

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch(err => {
                    done(err);
                })
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({}).then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => {
                    done(err);
                })                
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                done();
            });
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object ID is invalid', done => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', done => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                Todo.findById(res.body.todo._id).then(todo => {
                    expect(todo).toBe(null);
                    done();
                }).catch(err => {
                    done(err);
                })
            })
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object ID is invalid', done => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        // update text, set completed true
        // assert 200
        // custom assert: verify response body has text prop = text sent, text changed, completed: true, completedAt is a number (toBeA)
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                text: 'First todo updated',
                completed: true
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe('First todo updated');
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        // update text, set completed false
        // assert 200
        // custom assert: response body text changed, completed is false, completedAt is null
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({
                text: 'Second todo updated',
                completed: false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe('Second todo updated');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});
