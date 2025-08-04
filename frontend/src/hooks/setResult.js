import { useEffect } from "react";
import { postServerData } from '../helper/helper';
import * as Action from '../store/result.reducer';

export const PushAnswer = (result) => async (dispatch) => {
  try {
    await dispatch(Action.pushResultAction(result));
  } catch (error) {
    console.log(error);
  }
};

export const updateResult = (index) => async (dispatch) => {
  try {
    dispatch(Action.updateResultAction(index));
  } catch (error) {
    console.log(error);
  }
};

/** insert user data */
export const usePublishResult = ({ result, username, attempts, points, achieved, setId }) => {
  useEffect(() => {
    const publish = async () => {
      try {
        if (!result || !username) {
          console.warn("Couldn't get result or username");
          return;
        }

        await postServerData(
          `${import.meta.env.VITE_BACKEND_URL}/api/result/${setId}`,
          { result, username, attempts, points, achieved, setId },
          (data) => data
        );
      } catch (error) {
        console.error("Error publishing result:", error);
      }
    };

    publish();
  }, [result, username, attempts, points, achieved, setId]); // Track all dependencies
};
