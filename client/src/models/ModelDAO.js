import axios from 'axios';
// Singleton class acting as a DAO layer to the model.
export class DataDao {
  static #instance;
  instance;
  #csrfToken;
  constructor() {
    if (!DataDao.#instance) {
      this.instance = axios.create({
        baseURL: "http://localhost:8000",
        timeout: 5000,
        withCredentials: true,
      });
      DataDao.#instance = this;
      this.instance.interceptors.request.use(function (config) {
        console.log("Token: ", DataDao.getInstance().#csrfToken);
        config.headers['X-CSRF-Token'] = DataDao.getInstance().#csrfToken;
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
      Object.seal(DataDao.#instance);
    }
    return DataDao.#instance;
  }

  static getInstance() {
    return new DataDao();
  }

  #handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Assuming response is in JSON format
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  async getCSRFToken() {
    try {
      console.log("in get token!")
      const response = await this.instance.get('csrf-token');
      // const { success, data } = response.data;
      if (response.data.csrfToken) {
        console.log("SUCCESSFUL TOKEN", response.data.csrfToken)
        this.#csrfToken = response.data.csrfToken;
        // axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
      }
    } catch (error) {
      console.log("in csrf token failure")
      console.error('Error fetching CSRF token:', error);
    }
    return null;
  }

  // Questions Methods

  // Sort questions by newest and re-display
  async sortQuestionsByNewest() {
        try {
      const response = await this.instance.get('questions/newest', );
      const { success, data } = response.data;
      if (success)
        return data;
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  // Get the most recent answer date for each question
  #getMostRecentAnswerDate(ansIds) {
    const relevantAnswers = this.getAllAnswers().filter(answer => ansIds.includes(answer.aid));
    return relevantAnswers.reduce((mostRecentDate, answer) => {
      const answerDate = new Date(answer.ansDate).getTime();
      return answerDate > mostRecentDate ? answerDate : mostRecentDate;
    }, 0);
  }

  // Sort the questions based on the most recent answer date
  async sortQuestionsByRecentAnswers() {
        try {
      const response = await this.instance.get('questions/recentlyAnswered');
      const { success, data } = response.data;
      if (success)
        return data;
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return []
    }
  }

  // Filter unanswered questions
  async getUnansweredQuestions() {
        try {
      const response = await this.instance.get('questions/unanswered');
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Function to perform search
  async search(query) {
    try {
      const response = await this.instance.get(`questions/search/${query}`);
      const { success, data } = response.data;
      if (success)
        return data;
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  // Get a specific question by its ID
  async getQuestionById(qid) {
        try {
      const response = await this.instance.get(`questions/${qid}`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Add new Question
  async addNewQuestion(question) {
        try {
      const response = await this.instance.post('questions/add', { question });
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Increments view count of the question
  async incrementViewCount(qid) {
    try {
      const response = await this.instance.get(`questions/${qid}/incrementViewCount`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Get answers for the question
  async filterAnswersBasedOnAnsIds(ansIdsList) {
        try {
      if (ansIdsList.length === 0) {
        return []
      }
      const response = await this.instance.get(`answers/filterByIds`, {
        params: {
          ids: ansIdsList.join(',')
        }
      });
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Add new Answer
  async addAnswer(answer, qid) {
        try {
      const response = await this.instance.post('answers/add', { answer, qid });
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }


  // Tags Methods

  // Get a tag by ID
  async getTagById(tagId) {
        try {
      const response = await this.instance.get(`tags/${tagId}`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      throw new Error('Error fetching data:', error);
    }
    return [];
  }

  // Get a tag by ID
  async getTagsById(tagIds) {
        try {
      const response = await this.instance.get(`tags`, {
        params: {
          ids: tagIds.join(',')
        }
      });
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      throw new Error('Error fetching data:', error);
    }
    return [];
  }

  async getTagsAndQuestionCount() {
        try {
      const response = await this.instance.get(`tags/questionCount`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // General methods

  // Get all questions
  async getAllQuestions() {
        try {
      const response = await this.instance.get('questions');
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Get all tags
  async getAllTags() {
        try {
      const response = await this.instance.get('tags');
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Get all answers
  async getAllAnswers() {
        try {
      const response = await this.instance.get('answers');
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

// Login method
async login(credentials) {
  console.log("IN MODELDAO LOGIN");
  try {
    console.log("inside the try of modeldao login");
    const response = await this.instance.post('auth/login', credentials);
    console.log("HERERERERER", response.data);
    const { success, data } = response.data;
    if (success) {
      console.log(success, data);
      return { success, data }; // Return as an object
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
  console.log("Login failed :(");
  return null; // lets login.jsx know that it was not successful
}


// Logout method
async logout() {
  console.log("IN MODELDAO LOGIN");
  try {
    console.log("inside the try of modeldao login");
    const response = await this.instance.post('auth/logout', null);
    console.log("HERERERERER", response.data);
    const { success, data } = response.data;
    if (success) {
      console.log(success, data);
      return { success, data }; // Return as an object
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
  console.log("Login failed :(");
  return null; // lets login.jsx know that it was not successful
}


async signup(credentials) {
  try {
    // const data = await this.getCSRFToken();
    // const csrfToken = data.csrfToken;
    // console.log("in signup: ", csrfToken)
      // if(csrfToken) {

        console.log("in signup, after csrf token retrieveda")
        const response = await this.instance.post('auth/signup', credentials);

        console.log("SIGNUP RESPONSE:", response);

        if (response.data && response.data.success && response.data.success ==  true && response.data.data.csrfToken) {
            console.log("Got the token in signup!");
            return true;
        } else {
            console.log("Signup failed:", response.data);
            return false;
        }
  
    // } 
    // else {
    //   console.log("no csrf token available")
    // }
  } catch (error) {
    console.error('Error signing up:', error);
    return false;
  }
}






    // get userName based on uid of user
    async getUsernameByUid(userId) {
      console.log(userId);
      try {
        console.log("inside the try of getUsername modelDAO")
        const response = await this.instance.get('getUsername', userId)
        const { success, data } = response.data
        if (success) {
          console.log(success)
          return data;
        }
      } catch (error) {
        console.error('Error getting username', error);
      }
      console.log("at end of getUSername in DAO");
      return null; 
    }

  async checkLoginGetUsername(credentials) {
    console.log("IN MODELDAO LOGIN")
      try {
        console.log("sdfgsdfgsdfg")
                const response = await this.instance.post('auth/checkLoginGetUsername', credentials);
          const { success, data } = response.data
          if (success) {
            console.log(success)
            return success, data;
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
        console.log(":(")
        return null; // lets login.jsx know that it was not successful
      }
      
   

    async test() {
      try {
        fetch('http://localhost:8000/auth/csrf-token', {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => console.log('In test - CSRF Token:', data.csrfToken))
      .catch(error => console.error('Error fetching CSRF token:', error));
    }
    catch {
      console.log("in test catch");
    }
  }


}
