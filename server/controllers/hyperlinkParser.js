// Regular expression to match hyperlinks pattern []()
const linkPattern = /(\[[^[]*\]\(.*?\))/gm;
const bracketsRegex = /\[(.+)\]/gm;
const parenthesisRegex = /\((https:\/\/.+)\)$/gm;

// Validate embedded hyperlinks in text
exports.validateLinks = (input) => {
    const matches = input.match(linkPattern);
    if (matches) {
        const invalidLinks = matches.filter(
            (match) => {
                const bracketMatches = match.match(bracketsRegex);
                if (bracketMatches === null || bracketMatches[0].trim() === '')
                    return true;
                const parenthesisMatches = match.match(parenthesisRegex);
                if (parenthesisMatches === null || parenthesisMatches[0].trim() === '')
                    return true;
                return false;
            }
        );

        if (invalidLinks.length > 0) {
            return false;
        } else {
            return true;
        }
    }
    return true;
};