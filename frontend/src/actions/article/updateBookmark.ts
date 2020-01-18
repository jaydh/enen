import axios from "axios";
import { serverIP } from "../../hosts";

function updateBookmarkRequested() {
  return {
    type: "UPDATE_BOOKMARK_REQUESTED"
  };
}

function updateBookmarkRejected(reason: string) {
  return {
    reason,
    type: "UPDATE_BOOKMARK_REJECTED"
  };
}

function updateBookmarkFulfilled(id: string, bookmark: string) {
  return {
    bookmark,
    id,
    type: "UPDATE_BOOKMARK_FULFILLED"
  };
}

export default function updateBookmark(id: string, bookmark: string) {
  return async (dispatch: any, getState: any) => {
    const token = getState().user.token;
    dispatch(updateBookmarkRequested());
    return axios({
      method: "POST",
      url: `${serverIP}/user/bookmark`,
      headers: { Authorization: `Bearer ${token}` },
      data: { id, bookmark }
    })
      .then(res => dispatch(updateBookmarkFulfilled(id, bookmark)))
      .catch(error => dispatch(updateBookmarkRejected(error)));
  };
}
