const Answer = require("../../models/answers");


class AnswerDocumentBuilder {
    constructor() {
        this.answer = new Answer();
    }

    setText(text) {
        this.answer.text = text;
        return this;
    }

    setQid(qid) {
        this.answer.qid = qid;
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

    setVotes(votes) {
        this.answer.votes = votes;
        return this;
    }

    setAccepted(accepted) {
        this.answer.accepted = accepted;
        return this;
    }

    build() {
        return this.answer;
    }
}

module.exports = AnswerDocumentBuilder;