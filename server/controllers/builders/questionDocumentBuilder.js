const Question = require("../../models/questions");

class QuestionDocumentBuilder {
    constructor() {
      this.question = new Question();
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
      this.question.tags = tagIds;
      return this;
    }
  
    setAskedBy(askedBy) {
      this.question.asked_by = askedBy;
      return this;
    }
  
    setAskDate(askDate) {
      this.question.ask_date_time = askDate;
      return this;
    }
  
    setViews(views) {
      this.question.views = views;
      return this;
    }
  
    build() {
      return this.question;
    }
}
module.exports = QuestionDocumentBuilder;