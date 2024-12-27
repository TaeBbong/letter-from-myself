import axios from "axios";

const getResult = async (id) => {
  try {
    const apiEndpoint = 'https://get-result-handler-wasoaojb7q-uc.a.run.app';
    const response = await axios.get(apiEndpoint, {
      params: { id },
    });
    const { resId, letter, image } = response.data;
    return { resId, letter, image };
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};

export default getResult;
