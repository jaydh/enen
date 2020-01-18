import axios from "axios";
import { serverIP } from "../../hosts";

function updateProgressRequested() {
  return {
    type: "UPDATE_PROGRESS_REQUESTED"
  };
}

function updateProgressRejected(reason: string) {
  return {
    reason,
    type: "UPDATE_PROGRESS_REJECTED"
  };
}

function updateProgressCompleted(id: string, progress: number) {
  return {
    id,
    progress,
    type: "UPDATE_PROGRESS_FULFILLED"
  };
}

export default function updateProgress(id: string, progress: number) {
  return async (dispatch: any, getState: any) => {
    const token = getState().user.token;
    dispatch(updateProgressRequested());
    return axios({
      method: "POST",
      url: `${serverIP}/user/progress`,
      headers: { Authorization: `Bearer ${token}` },
      data: { id, progress }
    })
      .then(res => {
        dispatch(updateProgressCompleted(id, progress));
      })
      .catch((e: string) => dispatch(updateProgressRejected(e)));
  };
}
