import axios from "axios";

const fetchResult = async (id) => {
  try {
    const response = await axios.get(`https://<firebase-functions-url>/get_result`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};
