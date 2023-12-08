const Comment = require("../../models/comments");

class CommentDocumentBuilder {
    constructor() {
        this.comment = new Comment();
    }

    setText(text) {
        this.comment.text = text;
        return this;
    }

    // setPostedBy(postedBy) {
    //     this.comment.postedBy = postedBy;
    //     return this;
    // }

    // setAssociatedObjectType(associatedObjectType) {
    //     this.comment.associatedObjectType = associatedObjectType;
    //     return this;
    // }

    // setAssociatedObjectId(associatedObjectId) {
    //     this.comment.associatedObjectId = associatedObjectId;
    //     return this;
    // }

    setVotes(votes) {
        this.comment.votes = votes;
        return this;
    }

    // setPostedDate(postedDate) {
    //     this.comment.postedDate = postedDate;
    //     return this;
    // }

    build() {
        return this.comment;
    }
}

module.exports = CommentDocumentBuilder;