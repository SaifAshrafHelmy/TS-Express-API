import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';

// Drop the collection before starting any of tests
beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {}
});

// GET ALL

describe('GET /api/v1/todos', () => {
  it('responds with a an array of todos', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }));
});

// POST ONE

let id = '';
describe('POST /api/v1/todos', () => {
  it('responds with an error if the todo is invalid', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }));

  it('responds with an inserted object if valid', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');

        expect(response.body.content).toBe('Learn TypeScript');
        expect(response.body.done).toBe(false);

        id = response.body._id;
      }));
});

// GET ONE

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo, if id IS valid and found', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');

        expect(response.body.content).toBe('Learn TypeScript');
        expect(response.body.done).toBe(false);

        expect(response.body._id).toBe(id);
      }));

  it('responds with an invalid ObjectId error, if id is not a valid mongodb ObjectId', async () =>
    request(app)
      .get('/api/v1/todos/123asd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422));

  it('responds with a not found error, if id is valid but not found', async () =>
    request(app)
      .get('/api/v1/todos/6512e3b9d3b779d76edc3d1a')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404));
});

// Update One

describe('PUT /api/v1/todos/:id', () => {
  it('responds with an error 422 unprocessable, if new todo is not valid or does not exist in the req, whether id is valid or not', async () =>
    request(app)
      .put('/api/v1/todos/6512e3b9d3b779d76edc3d1a')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422));

  it('responds with an invalid ObjectId error, if id is not a valid mongodb ObjectId', async () =>
    request(app)
      .put('/api/v1/todos/123asd')
      .set('Accept', 'application/json')
      .send({
        content: 'UPDATED: Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(422));

  it('responds with a not found error, if id is valid but not found', async () =>
    request(app)
      .put('/api/v1/todos/6512e3b9d3b779d76edc3d1a')
      .set('Accept', 'application/json')
      .send({
        content: 'UPDATED: Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(404));

  it('responds with a single todo, if id IS valid and found', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'UPDATED: Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');

        expect(response.body.content).toBe('UPDATED: Learn TypeScript');
        expect(response.body.done).toBe(false);

        expect(response.body._id).toBe(id);
      }));
});

// DELETE One

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with a single todo, if id IS valid and found', async () =>
    request(app)
      .delete(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect(204));

  it('responds with an invalid ObjectId error, if id is not a valid mongodb ObjectId', async () =>
    request(app)
      .delete('/api/v1/todos/123asd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422));

  it('responds with a not found error, if id is valid but not found', async () =>
    request(app)
      .delete('/api/v1/todos/6512e3b9d3b779d76edc3d1a')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404));
});
