import { OBJECT_TYPES } from '../models/enums';

// Helper function to format metadata for questions and answer
export function metadataFormatter(post, typeOfPost) {
    var verbString = '';
    var userParam = '';
    var dateParam = '';
    const now = new Date();

    if(typeOfPost === OBJECT_TYPES.QUESTION) {
        verbString = "asked";
        userParam = post.askedBy;
        dateParam = post.askDate;
    }
    else if (typeOfPost === OBJECT_TYPES.ANSWER) {
        verbString = "answered";
        userParam = post.ans_by;
        dateParam = post.ansDate;
    }
    else {
        verbString = "posted";
        userParam = post.postedBy;
        dateParam = post.postedDate;
    }

    const pastDate = new Date(dateParam);
    const timeDiffMillis = now - pastDate;

    // If the question was asked within the last minute, show seconds
    if (timeDiffMillis > 0 && timeDiffMillis < 60000) {
        const seconds = timeDiffMillis / 1000;
        return `${userParam} ${verbString} ${Math.round(seconds)} seconds ago`;
    }

    // If the question was asked within the last hour, show minutes
    if (timeDiffMillis > 0 && timeDiffMillis < 3600000) {
        const minutes = timeDiffMillis / 60000;
        return `${userParam} ${verbString} ${Math.round(minutes)} minutes ago`;
    }

    // If the question was asked within the last 24 hours, show hours
    if (timeDiffMillis > 0 && timeDiffMillis < 86400000) {
        const hours = timeDiffMillis / 3600000;
        return `${userParam} ${verbString} ${Math.round(hours)} hours ago`;
    }

    // If the question was asked more than 24 hours ago, show the date
    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return `${userParam} ${verbString} ${pastDate.toLocaleDateString('en-US', options)}`;
}