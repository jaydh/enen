export default (
  state = {
    userName: undefined,
    signedIn: false,
    token: undefined,
    iat: undefined,
    email: undefined,
    eat: undefined
  },
  action: any
) => {
  switch (action.type) {
    case "LOGIN":
      const { payload } = action;
      const { userName, email, accessToken: token } = payload;
      return {
        ...state,
        userName,
        email,
        token,
        signedIn: true
      };
    case "VALIDATE_TOKEN":
      return { ...state, ...action.payload };
    case "VALIDATE_TOKEN_FAILED":
      return {};
    default:
      return state;
  }
};
