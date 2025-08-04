import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from 'axios';

// Get number of attempted answers
export function attempts_Number(result) {
  return result.filter(r => r !== undefined).length;
}

// Calculate earned points
export function earnPoints_Number(result, answers, point) {
  return result
    .map((element, i) => answers[i] === element)
    .filter(Boolean)
    .map(() => point)
    .reduce((prev, curr) => prev + curr, 0);
}

// Check if the result passes (more than 50%)
export function flagResult(totalPoints, earnPoints) {
  return (totalPoints * 0.5) < earnPoints;
}

// Check if user exists in Redux store before allowing access
export function CheckUserExist({ children }) {
  const auth = useSelector(state => state.result.userId);
  return auth ? children : <Navigate to="/" />;
}

// Get data from server
export async function getServerData(url, callback) {
  try {
    const { data } = await axios.get(url);
    return callback ? callback(data) : data;
  } catch (error) {
    console.error("Error fetching server data:", error);
    return callback ? callback({ error: error.message }) : { error: error.message };
  }
}

// Post data to server
export async function postServerData(url, result, callback) {
  try {
    const { data } = await axios.post(url, result);
    return callback ? callback(data) : data;
  } catch (error) {
    console.error("Error posting server data:", error);
    return callback ? callback({ error: error.message }) : { error: error.message };
  }
}
