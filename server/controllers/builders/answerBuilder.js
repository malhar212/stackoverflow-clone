const Answer = require("./answer");

class AnswerBuilder {
    constructor() {
        this.answer = new Answer();
    }

    setAid(aid) {
        this.answer.aid = aid;
        return this;
    }

    setText(text) {
        this.answer.text = text;
        return this;
    }

    setAnsBy(ansBy) {
        this.answer.ansBy = ansBy;
        return this;
    }

    setAnsDate(ansDate) {
        this.answer.ansDate = ansDate;
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

module.exports = AnswerBuilder;