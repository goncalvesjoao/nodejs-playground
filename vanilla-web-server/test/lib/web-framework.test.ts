import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { Get, Controller, RequestType, ResponseType } from '@lib/web-framework';
import { RequestBuilder } from '@test/support/utils';

class BaseController extends Controller {}

class RootController extends BaseController {
  @Get('')
  async index(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 200, body: { message: 'home page' } });
  }
}

class ApiController extends BaseController {
  static basePath = 'api/';

  @Get('{/*path}')
  async index(req: RequestType): Promise<ResponseType> {
    if (req.path === this.path || req.path === `${this.path}/`) {
      return Promise.resolve({
        status: 200,
        body: { message: 'api index' },
      });
    }

    return Promise.resolve({
      status: 501,
      body: { message: 'Not Implemented' },
    });
  }
}

class PostsApiController extends ApiController {
  static basePath = 'posts';

  @Get('')
  async index(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 200, body: { message: 'posts index' } });
  }

  @Get('/:id')
  async show(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 200, body: { message: 'posts show' } });
  }

  @Get('/:id/edit/')
  async edit(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 200, body: { message: 'posts edit' } });
  }
}

void describe('lib - web-framework - Controller', () => {
  void describe('#handle', () => {
    void test('returns false when no handler matches the request', async () => {
      const controller = new ApiController();

      const response = await controller.handle(
        RequestBuilder({ path: 'api', method: 'POST' }),
      );

      assert.equal(response, false);
    });

    void test('returns a response when a handler matches the request', async () => {
      const controller = new ApiController();

      const response = await controller.handle(RequestBuilder({ path: 'api' }));

      assert.ok(response);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'api index' });
    });

    void test('returns a response even when the request starts with "/" and action is ""', async () => {
      const controller = new ApiController();

      const response = await controller.handle(
        RequestBuilder({ path: '/api' }),
      );

      assert.ok(response);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'api index' });
    });

    void test('returns a response even when the request starts and ends with "/" and action is ""', async () => {
      const controller = new ApiController();

      const response = await controller.handle(
        RequestBuilder({ path: '/api/' }),
      );

      assert.ok(response);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'api index' });
    });

    void test('returns a response when the request ends with "/" and action is suffixed with ""', async () => {
      const controller = new PostsApiController();

      const response = await controller.handle(
        RequestBuilder({ path: '/api/posts/1/' }),
      );

      assert.ok(response);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'posts show' });
    });

    void test('returns a response when the request ends with "/" and action also ends with "/"', async () => {
      const controller = new PostsApiController();

      const response = await controller.handle(
        RequestBuilder({ path: '/api/posts/1/edit/' }),
      );

      assert.ok(response);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'posts edit' });
    });
  });

  void describe('#path', () => {
    void test('returns .basePath concatenated with ancestor paths', () => {
      assert.equal(new RootController().path, '/');
      assert.equal(new ApiController().path, '/api');
      assert.equal(new PostsApiController().path, '/api/posts');
    });
  });
});
