const Page = require('./helpers/page');
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When loged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
  
    expect(label).toEqual('Blog Title');
  });

  describe('Using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'Test title');
      await page.type('.content input', 'Test content');

      await page.click('form button');
    });

    test('submitting takes user reviews screen', async () => {
      const saveText = await page.getContentsOf('h5');

      expect(saveText).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('Test title');
      expect(content).toEqual('Test content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows error messages', async () => {
      const errMessage = await page.getContentsOf('.title div.red-text');

      expect(errMessage).toEqual('You must provide a value');
    });
  });
});

describe('When user is not loged in', async () => {
  test('user can not create new blog', async () => {
    const result = await page.evaluate(
      () => {
        return fetch('/api/blogs', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: 'test title', content: 'test content'})
        })
        .then(res => res.json());
      }
    );

    expect(result.error).toEqual('You must log in!');
  });

  test('user can not retreive blogs list', async () => {
    const result = await page.evaluate(
      () => {
        return fetch('/api/blogs', {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json());
      }
    );

    expect(result.error).toEqual('You must log in!');
  });
});
