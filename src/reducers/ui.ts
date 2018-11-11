import produce from 'immer';

export default (state = {} as any, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_LAST_ARTICLE':
        draft.lastArticle = action.id;
        break;
      case 'SET_SEARCH':
        draft.search = action.value;
        break;
    }
  });
