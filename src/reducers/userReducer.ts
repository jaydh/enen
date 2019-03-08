export default (
  state = {
    signedIn: false,
    token: undefined,
    iat: undefined,
    email: undefined,
    eat: undefined
  },
  action: any
) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.token, signedIn: true };
    case 'VALIDATE_TOKEN':
      return { ...state, ...action.payload };
    case 'VALIDATE_TOKEN_FAILED':
      return {};
    default:
      return state;
  }
};
