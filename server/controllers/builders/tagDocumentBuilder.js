const Tag = require("../../models/tags");

class TagDocumentBuilder {
    constructor() {
        this.tag = new Tag();
    }

    setName(name) {
        this.tag.name = name;
        return this;
    }

    build() {
        return this.tag;
    }
}

module.exports = TagDocumentBuilder;