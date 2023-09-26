import request from 'supertest';

import app from '../app';

describe('GET /api/v1', () => {
  it('responds with a json message', async () => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          message: 'API - 👋🌎🌍🌏',
        });
      });
  });
});

// done is a doneness callback function that you pass to indicate this is an async function
// then you call it to signal that the test is complete
//  you can REPLACE IT with async/await
//  if you don't use one the two, you'll get this error

/* Jest did not exit one second after the test run has completed.
'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue. */
