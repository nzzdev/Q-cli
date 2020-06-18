module.exports = {
  allowQueryToken: false, // optional, true by default
  allowMultipleHeaders: false, // optional, false by default
  accessTokenName: "access_token", // optional, 'access_token' by default
  validate: async function (request, token, h) {
    const user = {};

    if (token.includes("demo-user")) {
      user.name = "demo-user";
    } else if (token.includes("demo-expert")) {
      user.name = "demo-expert";
    } else if (token.includes("demo-poweruser")) {
      user.name = "demo-poweruser";
    } else {
      return {
        isValid: false,
      };
    }

    user.token = token;
    user.email = user.name + "@q.tools";

    return {
      isValid: true,
      credentials: user,
    };
  },
};
