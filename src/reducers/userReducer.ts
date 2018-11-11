export default (
  state = {
    signedIn: false
  },
  action: any
) => {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, ...action.user, signedIn: true };
    case 'SIGN_OUT':
      return { ...state, signedIn: false };

    default:
      return state;
  }
};
