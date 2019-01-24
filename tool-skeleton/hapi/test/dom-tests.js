const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const lab = (exports.lab = Lab.script());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

function element(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelector(selector));
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("Q dom tests", () => {
  it("should display the title", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/basic.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(response.result.markup, "h1").then(value => {
      expect(value).to.be.equal(1);
    });
  });
});
