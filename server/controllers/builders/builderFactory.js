const AnswerBuilder = require("./answerBuilder");
const AnswerDocumentBuilder = require("./answerDocumentBuilder");
const CommentBuilder = require("./commentBuilder");
const CommentDocumentBuilder = require("./commentDocumentBuilder");
const QuestionBuilder = require("./questionBuilder");
const QuestionDocumentBuilder = require("./questionDocumentBuilder");
const TagBuilder = require("./tagBuilder");
const TagDocumentBuilder = require("./tagDocumentBuilder");

class BuilderFactory {
    createBuilder(options) {
        return new BuilderFactoryImpl().createBuilder(options)
    }
}

class BuilderFactoryImpl extends BuilderFactory {
    // Our default 
    constructor() {
        super();
        this.builder = null;
    }

    // Our Factory method for creating new Builder instances
    createBuilder(options) {
        switch (options.builderType) {
            case 'question':
                this.builder = QuestionDocumentBuilder;
                break;
            case 'questionUI':
                this.builder = QuestionBuilder;
                break;
            case 'answer':
                this.builder = AnswerDocumentBuilder;
                break;
            case 'answerUI':
                this.builder = AnswerBuilder;
                break;
            case 'tag':
                this.builder = TagDocumentBuilder;
                break;
            case 'tagUI':
                this.builder = TagBuilder;
                break;
            case 'comment':
                this.builder = CommentDocumentBuilder;
                break;
            case 'commentUI':
                this.builder = CommentBuilder;
                break;
        }
        return new this.builder();
    }
}

module.exports = BuilderFactory;