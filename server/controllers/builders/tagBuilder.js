const Tag = require("./tag");

class TagBuilder {
    constructor() {
        this.tag = new Tag();
    }

    setTid(tid) {
        this.tag.tid = tid;
        return this;
    }

    setName(name) {
        this.tag.name = name;
        return this;
    }

    setQuestionCount(questionCount) {
        this.tag.questionCount = questionCount;
        return this;
    }

    setEditable(editable) {
        this.tag.editable = editable;
        return this;
    }

    build() {
        return this.tag;
    }
}

module.exports = TagBuilder;