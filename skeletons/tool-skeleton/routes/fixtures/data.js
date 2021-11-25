const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
const fixtureData = [require(`${fixtureDataDirectory}/basic.json`)];

module.exports = {
  path: "/fixtures/data",
  method: "GET",
  options: {
    tags: ["api"],
  },
  handler: (request, h) => {
    return fixtureData;
  },
};
