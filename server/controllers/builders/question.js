class Question {
  constructor() {
    this.qid = '';
    this.title = '';
    this.text = '';
    this.tagIds = [];
    this.askedBy = '';
    this.askDate = '';
    this.ansIds = [];
    this.views = 0;
    this.votes = 0;
  }
}
module.exports = Question;