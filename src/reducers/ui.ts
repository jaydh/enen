import produce from 'immer';

export default (
  state = { showCompleted: false, sort: 'date' } as any,
  action: any
) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_LAST_ARTICLE':
        draft.lastArticle = action.id;
        break;
      case 'SET_SEARCH':
        draft.search = action.value;
        break;
      case 'SET_SORT':
        draft.sort = action.value;
        break;
      case 'TOGGLE_SHOW_COMPLETED':
        draft.showCompleted = !state.showCompleted;
        break;
    }
  });
