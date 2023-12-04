import axios from 'axios';
// Singleton class acting as a DAO layer to the model.
export class DataDao {
  static #instance;
  instance;
  constructor() {
    if (!DataDao.#instance) {
      this.instance = axios.create({
        baseURL: "http://localhost:8000",
        timeout: 5000
      });
      DataDao.#instance = this;
      Object.freeze(DataDao.#instance);
    }
    return DataDao.#instance;
  }

  static getInstance() {
    return new DataDao();
  }

  // Questions Methods

  // Sort questions by newest and re-display
  async sortQuestionsByNewest() {
    try {
      const response = await this.instance.get('questions/newest');
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
      console.log("IN MODELDAO LOGIN")
      try {
        console.log("inside the try of modeldao login")
        const response = await this.instance.post('auth/login', credentials, {
          withCredentials: true,
        });
        const { success, data } = response.data
        if (success) {
          console.log(success)
          return success, data;
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
      console.log("Login failed :(")
      return null; // lets login.jsx know that it was not successful
    }
}