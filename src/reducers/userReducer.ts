export default (
  state = {
    signedIn: false,
    token: undefined
  },
  action: any
) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.token, signedIn: true };

    default:
      return state;
  }
};
