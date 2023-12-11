import React from 'react';
// Regular expression to match hyperlinks pattern []()
const linkPattern = /(\[[^[]*\]\(.*?\))/gm;
const bracketsRegex = /\[(.+)\]/gm;
const parenthesisRegex = /\((https:\/\/.+)\)$/gm;

// Parse hyperlinks in answer and question text
function HyperLinkParser({ text }) {
    const matches = text.match(linkPattern);
    // // console.log(text);
    if (matches) {
        const textParts = text.split(linkPattern);
        const returnParts = textParts.map(
            (part, index) => {
                if (part.match(linkPattern)) {
                    const bracketMatches = part.match(bracketsRegex);
                    if (bracketMatches === null || bracketMatches[0].trim() === '')
                        return '';
                    const parenthesisMatches = part.match(parenthesisRegex);
                    if (parenthesisMatches === null || parenthesisMatches[0].trim() === '')
                        return '';
                    const linkText = bracketMatches[0].trim().substring(1, bracketMatches[0].length - 1);
                    const link = parenthesisMatches[0].trim().substring(1, parenthesisMatches[0].length - 1);
                    return buildAnchorTag(index, linkText, link);
                }
                return (<React.Fragment key={index}>{part}</React.Fragment>)
            }
        );
        return (<>{returnParts}</>);
    }
    return (<>{text}</>);
}

export default HyperLinkParser;

function buildAnchorTag(index, linkText, link) {
    return (<a key={index} href={link} target="_blank" rel="noopener noreferrer">{linkText}</a>)
}

// Validate embedded hyperlinks
export function validateLinks(input) {
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
}