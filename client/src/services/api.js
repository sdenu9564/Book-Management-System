import axios from "axios";
const base_url = "http://localhost:9000/api"


export const singup = async(data) => {
  console.log(data);
  try {
      const response = await axios.post(`${base_url}/auth/singup`, data)
      return response?.data;
  } catch (error) {
    console.error(error);
  }
}

export const login = async(email, password) => {
    try {
        const response = await axios.post(`${base_url}/auth/login`,{email,password})
        return response?.data;
    } catch (error) {
        console.error(error);
    }
}


export const addBook = async (bookData, account) => {
    try {
      const response = await axios.post(
        `${base_url}/books/publish`,
         bookData ,
        {
          headers: {
            Authorization: ` ${account?.token}`,
          },
        }
      );
  
      console.log('API Response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
      }
  
      throw error;
    }
};

export const getAllBooks = async(account) => {
    try {
        const response = await axios.get(
            `${base_url}/books/published`,
            {
                headers :{
                    Authorization : ` ${account?.token}`
                }
            }
        )
        return response?.data;
    } catch (error) {
        console.error('Error response data',error.response?.data)
    }
}


export const unPublished = async(bookId, account) => {
  try {
    console.log(bookId,'--------------')
    const response = await axios.put(
      `${base_url}/books/unpublish/${bookId}`,
      {}, // empty body since it's a PUT request
      {
        headers: {
          Authorization: `${account?.token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Error response',error)
  }
}

export const searchbyTitle = async (title, account) => {
  try {
    const response = await axios.get(
      `${base_url}/books/search`,
      {
        headers: {
          Authorization: `${account?.token}`,
        },
        params: {
          title: title,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Error response', error);
  }
};

export const getBooksbyUserId = async (account) => {
    try {
      const response = await axios.get(
        `${base_url}/books/user`,
      {
        headers: {
          Authorization: `${account?.token}`,
        }
      }
      );
      return response?.data;


    } catch (error) {
      console.error('Error response',error);
    }
} 


  