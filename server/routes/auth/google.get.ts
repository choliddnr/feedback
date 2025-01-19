import { User } from "#auth-utils";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    console.log("user", user, tokens);
    const registeredUser = await $fetch<User[]>("/api/user/getOne", {
      query: {
        k: "email",
        v: user.email,
      },
      onResponse: ({ response }) => {
        console.log(response._data);
      },
    });

    if (registeredUser.length === 0) {
      await setUserSession(event, {
        // User data
        user: {
          id: user.sub,
          picture: user.picture,
          email: user.email,
          default_merchant: null,
          name: user.name,
          username: ``,
        },
        // Private data accessible only on server/ routes

        // Any extra fields for the session data
        loggedInAt: new Date(),
      });
      return sendRedirect(event, "/auth/register");
    } else {
      await setUserSession(event, {
        // User data
        user: {
          id: registeredUser[0].id,
          picture: registeredUser[0].picture,
          email: registeredUser[0].email,
          default_merchant: registeredUser[0].default_merchant,
          name: registeredUser[0].name,
          username: registeredUser[0].username,
        },
        // Private data accessible only on server/ routes

        // Any extra fields for the session data
        loggedInAt: new Date(),
      });
      return sendRedirect(event, "/admin");
    }
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/auth");
  },
});
