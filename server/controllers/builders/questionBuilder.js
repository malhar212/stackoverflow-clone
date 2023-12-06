const Question = require("./question");

class QuestionBuilder {
    constructor() {
      this.question = new Question();
    }
  
    setQid(qid) {
      this.question.qid = qid;
      return this;
    }
  
    setTitle(title) {
      this.question.title = title;
      return this;
    }
  
    setText(text) {
      this.question.text = text;
      return this;
    }
  
    setTagIds(tagIds) {
      this.question.tagIds = tagIds;
      return this;
    }
  
    setAskedBy(askedBy) {
      this.question.askedBy = askedBy;
      return this;
    }
  
    setAskDate(askDate) {
      this.question.askDate = askDate;
      return this;
    }
  
    setViews(views) {
      this.question.views = views;
      return this;
    }
  
    setVotes(votes) {
      this.question.votes = votes;
      return this;
    }

    setAnswerCount(count) {
      this.question.answerCount = count;
      return this;
    }

    build() {
      return this.question;
    }
}

module.exports = QuestionBuilder;