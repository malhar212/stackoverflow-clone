import axios from 'axios';
// Singleton class acting as a DAO layer to the model.
export class DataDao {
  static #instance;
  instance;
  #csrfToken;
  setLoggedInFunc;
  setPageAndParamsFunc;
  constructor() {
    if (!DataDao.#instance) {
      this.instance = axios.create({
        baseURL: "http://localhost:8000",
        timeout: 5000,
        withCredentials: true,
      });
      DataDao.#instance = this;
      this.instance.interceptors.request.use(function (config) {
        config.headers['X-CSRF-Token'] = DataDao.getInstance().#csrfToken;
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
      // Add a response interceptor
      this.instance.interceptors.response.use(
        response => {
          // If the request succeeds, just return the response
          return response;
        },
        async error => {
          const { config, response: { status } } = error;

          // If the response status is 401 (Unauthorized)
          if (status === 401) {
            this.setLoggedInFunc(false);
            sessionStorage.clear();
            this.setPageAndParamsFunc('welcome', {})
          }

          // If the response status is 403 (Forbidden) and the request was not retried
          if (status === 403 && !config.__isRetryRequest) {
            config.__isRetryRequest = true;
              await DataDao.getInstance().getCSRFToken();
              config.headers['X-CSRF-TOKEN'] = DataDao.getInstance().#csrfToken;
              const res = await this.instance(config);
              return res;
          }
          throw error;
        }
      );
      //Object.seal(DataDao.#instance);
    }
    return DataDao.#instance;
  }

  static getInstance() {
    return new DataDao();
  }

   // Method to set context/state handling functions
   setContextFunctions(setLoggedIn, setPageAndParams) {
    this.setLoggedInFunc = setLoggedIn;
    this.setPageAndParamsFunc = setPageAndParams;
  }

  async getCSRFToken() {
    try {
      const response = await this.instance.get('csrf-token');
      // const { success, data } = response.data;
      if (response.data && response.data.csrfToken) {
        this.#csrfToken = response.data.csrfToken;
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
      const response = await this.instance.get('questions/newest',);
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
  async sortQuestionsByActivity() {
    try {
      const response = await this.instance.get('questions/activity');
      const { success, data } = response.data;
      if (success)
        return data;
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return []
    }
  }

  async fetchUserQuestions() {
    try {
      console.log("In fetchUserQuestions 1")
      const response = await this.instance.get(`questions/fetchUserQuestions`);
      console.log("In fetchUserQuestions 2")
      const { success, data } = response.data;
      if (success) {
        console.log("Response is... " + JSON.stringify(response.data, null, 4))
        return data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
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
  async search(query, sort) {
    try {
      const response = await this.instance.get(`questions/search/${query}?sort=${sort}`);
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

// called from editQuestionPage
// await dao.updateQuestionById(params, { text: questionText });
async updateQuestionById(questionId, { text: questionText }) {
  try {
    console.log("in update q by id: " + JSON.stringify(questionId, null, 4));
    const response = await this.instance.put(`/questions/${questionId}/update`, { text: questionText });
    console.log("got response? " + response.data)
    const { success, data } = response.data;

    if (success) {
      console.log('Question updated successfully:', data);
      return data;
    } else {
      console.error('Failed to update question:', data.message);
    }
  } catch (error) {
    console.error('Error updating question:', error);
  }
  return null;
}




  // Add new Question
  async addNewQuestion(question) {
    try {
      console.log("ModelDAO addNewQuestion: ");
      console.log("NEW Q: " + JSON.stringify(question, null, 4));
      const response = await this.instance.post('questions/add', { question });
      console.log("++++++++++modelDAO addNewQuestion question" + JSON.stringify(question, null, 5))
      const { success, data } = response.data;
      console.log("++++++++++modelDAO addNewQuestion resp.data:" + JSON.stringify(response.data, null, 4))
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


  async deleteQuestionById(questionId) {
    try {
      const response = await this.instance.delete(`/questions/${questionId}`);
      const { success, data } = response.data;
      if (success) {
        console.log('Question deleted successfully:', data);
        return data;
      } else {
        console.error('Failed to delete question:', data.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
    return null;
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

  // Get answers for the question
  async filterAnswersBasedOnQuestionId(qid) {
    try {
      const response = await this.instance.get(`answers/question/${qid}`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Get answers for the question
  async fetchUserAnswers() {
    try {
      console.log("IN FILTERANSWERSBASEDONUSER ")
      const response = await this.instance.get(`answers/fetchUserAnswers`);
      console.log("GOT RESPONSE IN FILTERANSWERSBASEDONUSER")
      const { success, data } = response.data;
      if (success)
        console.log("Response is... " + JSON.stringify(response.data, null, 4))
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

// called from editAnswersPage
// await dao.updateAnswerById(params, { text: answerText });
async updateAnswerById(ansId, { text: answerText }) {
    try {
      console.log(JSON.stringify(ansId, null, 4));
      console.log(JSON.stringify(answerText, null, 4));
      const response = await this.instance.put(`/answers/${ansId}`, { text: answerText });
      const { success, data } = response.data;
  
      if (success) {
        console.log('Answer updated successfully:', data);
        return data;
      } else {
        console.error('Failed to update answer:', data.message);
      }
    } catch (error) {
      console.error('Error updating answer:', error);
    }
    return null;
  }

  async deleteAnswerById(ansId) {
    try {
      const response = await this.instance.delete(`/answers/${ansId}`);
      const { success, data } = response.data;
      if (success) {
        console.log('Answer deleted successfully:', data);
        return data;
      } else {
        console.error('Failed to delete answer:', data.message);
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
    return null;
  }

  // Add new Answer
  async addAnswer(answer, qid) {
    try {
      console.log(JSON.stringify(answer, null, 4));
      console.log("IN ADD ANSWER DAO 1 ")
      const response = await this.instance.post('answers/add', { answer, qid });
      console.log("IN ADD ANSWER DAO 2 ")
      const { success, data } = response.data;
      console.log("IN ADD ANSWER DAO 3 ")
      if (success)
        console.log("IN ADD ANSWER DAO SUCCESS ");
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  async acceptAnswer(ansId) {
    try {
      console.log(ansId);
      const response = await this.instance.put(`/answers/accept/${ansId}`);
      const { success, data } = response.data;
      if (success) {
        console.log('Answer accepted successfully:', data);
        return data;
      } else {
        console.error('Failed to accept answer:', data.message);
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
    return null;
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
      console.error('Error fetching data:', error);
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
        console.error('Error fetching data:', error);
      }
      return [];
    }
  

  async deleteTagByName(tagName) {
    try {
      console.log("in delete tag by name 1")
      const response = await this.instance.delete(`tags/deleteByName/${tagName}`);
      console.log("in delete tag by name 2")
      const { success } = response.data;
      if (success) {
        console.log(`Tag with name ${tagName} deleted successfully`);
      } else {
        console.error(`Error deleting tag with name ${tagName}`);
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw new Error('Error deleting tag:', error);
    }
  }

// called from editTagePage
// await dao.updateTagByName(params, {name: tagName});
async updateTagByName(tagName, { name : newTagName }) {
  try {
    console.log(tagName) // previous tag name
    console.log(newTagName) // new tag name
    const response = await this.instance.put(`/tags/${tagName}/update`, { name : newTagName });
    const { success, data } = response.data;
    if (success) {
      console.log('Tag updated successfully:', data);
      return data;
    } else {
      console.error('Failed to update tag:', data.message);
    }
  } catch (error) {
    console.error('Error updating tag:', error);
  }

  return null;
}

  async fetchTagsByUsername(username) {
    try {
      const response = await this.instance.get(`tags/byUsername/${username}`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      throw new Error('Error fetching tags by user:', error);
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

  // Comment methods

  // Get a comments by associated Object ID
  async fetchComments(associatedObjectId) {
    try {
      const response = await this.instance.get(`comments/object/${associatedObjectId}`);
      const { success, data } = response.data;
      if (success)
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Add new Answer
  async addComment(comment) {
    try {
      const response = await this.instance.post('comments/add', { comment });
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
      console.error('Error fetching data:', error.message);
    }
    return [];
  }

  // vote 
  async vote(vote) {
    try {
      const response = await this.instance.post(`vote`, { vote });
      const { success, data } = response.data;
      if (success)
        return data;
      else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return [];
  }

  // Login method
  async login(credentials) {
    try {
      const response = await this.instance.post('auth/login', credentials);
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
    try {
      const response = await this.instance.post('auth/logout', null);
      const { success, data } = response.data;
      if (success) {
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
      const response = await this.instance.post('auth/signup', credentials);
      if (response.data && response.data.success && response.data.success == true && response.data.data.csrfToken) {
        return true;
      } else {
        console.log("Signup failed:", response.data);
        return false;
      }

    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  }


  // get userName based on uid of user
  async getUserProfile() {
    try {
      const response = await this.instance.get('users/getUserProfile')
      const { success, data } = response.data
      if (success) {
        return data;
      }
    } catch (error) {
      console.error('Error getting username', error);
    }
    return null;
  }

  async checkLoginGetUsername(credentials) {
    try {
      const response = await this.instance.post('auth/checkLoginGetUsername', credentials);
      const { success, data } = response.data
      if (success) {
        return success, data;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
    return null;
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
