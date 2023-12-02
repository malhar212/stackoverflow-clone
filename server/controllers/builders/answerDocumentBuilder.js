const Answer = require("../../models/answers");


class AnswerDocumentBuilder {
    constructor() {
        this.answer = new Answer();
    }

    setText(text) {
        this.answer.text = text;
        return this;
    }

    setAnsBy(ansBy) {
        this.answer.ans_by = ansBy;
        return this;
    }

    setAnsDate(ansDate) {
        this.answer.ans_date_time = ansDate;
        return this;
    }

    build() {
        return this.answer;
    }
}

module.exports = AnswerDocumentBuilder;