const Page = require('./helpers/page');
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('Header has a correct text', async () => {
  const txt = await page.getContentsOf('a.brand-logo');

  expect(txt).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, should seen logout button', async () => {
  await page.login();
  const txt = await page.getContentsOf('a[href="/auth/logout"]');
  expect(txt).toEqual('Logout');
});
