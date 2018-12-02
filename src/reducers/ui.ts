import produce from 'immer';

interface IState {
  fontSize: number;
  showCompleted: boolean;
  sort: string;
  label?: string;
  search?: string;
  lastArticle?: string;
}

export default (
  state: IState = {
    fontSize: 16,
    showCompleted: false,
    sort: 'date'
  },
  action: any
) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_LAST_ARTICLE':
        draft.lastArticle = action.article;
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
      case 'INCREASE_FONT_SIZE':
        draft.fontSize += 1;
        break;
      case 'DECREASE_FONT_SIZE':
        draft.fontSize -= 1;
      case 'SET_LABEL':
        draft.label = action.label;
    }
  });
