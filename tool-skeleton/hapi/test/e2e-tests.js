const fs = require("fs");
const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const lab = (exports.lab = Lab.script());

const glob = require("glob");

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
    await server.register(require("inert"));
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

lab.experiment("basics", () => {
  it("starts the server", () => {
    expect(server.info.created).to.be.a.number();
  });

  it("is healthy", async () => {
    const response = await server.inject("/health");
    expect(response.payload).to.equal("ok");
  });
});

lab.experiment("schema endpoint", () => {
  it("returns 200 for /schema.json", async () => {
    const response = await server.inject("/schema.json");
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("locales endpoint", () => {
  it("returns 200 for en translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/en/translation.json"
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
  it("returns 200 for fr translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/fr/translation.json"
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
  it("returns 200 for de translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/de/translation.json"
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("stylesheets endpoint", () => {
  it(
    "returns existing stylesheet with right cache control header",
    { plan: 2 },
    async () => {
      const filename = require("../styles/hashMap.json").default;
      const response = await server.inject(`/stylesheet/${filename}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.headers["cache-control"]).to.be.equal(
        "max-age=31536000, immutable"
      );
    }
  );

  it("returns Not Found when requesting an inexisting stylesheet", async () => {
    const response = await server.inject("/stylesheet/inexisting.123.css");
    expect(response.statusCode).to.be.equal(404);
  });
});

// all the fixtures render
lab.experiment("all fixtures render", async () => {
  const fixtureFiles = glob.sync(
    `${__dirname}/../resources/fixtures/data/*.json`
  );
  for (let fixtureFile of fixtureFiles) {
    const fixture = require(fixtureFile);
    it(`doesnt fail in rendering fixture ${fixture.title}`, async () => {
      const request = {
        method: "POST",
        url: "/rendering-info/web",
        payload: {
          item: fixture,
          toolRuntimeConfig: {}
        }
      };
      const response = await server.inject(request);
      expect(response.statusCode).to.be.equal(200);
    });
  }
});

lab.experiment("rendering-info", () => {
  it("web: returns error 400 if invalid item is given", async () => {
    const request = {
      method: "POST",
      url: "/rendering-info/web",
      payload: {
        item: {
          some: "object",
          that: "doesn't validate against the schema"
        },
        toolRuntimeConfig: {}
      }
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(400);
  });
});

lab.experiment("assets", () => {
  it("returnes stylesheet", async () => {
    const fixture = fs.readFileSync(
      `${__dirname}/../resources/fixtures/data/basic.json`,
      { encoding: "utf-8" }
    );
    const res = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: JSON.parse(fixture),
        toolRuntimeConfig: {}
      }
    });
    const stylesheetRes = await server.inject(
      `/stylesheet/${res.result.stylesheets[0].name}`
    );
    expect(stylesheetRes.statusCode).to.be.equal(200);
  });
});
