import React, { useEffect, useState } from 'react';
import TagPill from './tagPill';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import { metadataFormatter } from '../metadataFormatter';
import TruncatedText from '../truncatedText';

// Create Individual Tag in each Question
function addTagPill(tag) {
    return <TagPill
        key={tag.tid}
        name={tag.name}
    />
}

// Individual Question in Question List
function Question({question}) {
    const { setPageAndParams } = useLocationContext();
    const dao = DataDao.getInstance();

    function handleClick(qid) {

        return async function(event) {
            event.preventDefault();
            await dao.incrementViewCount(qid)
            setPageAndParams("answers", {qid});
        }
    }
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const getData = async () => { 
            console.log(JSON.stringify(question, null, 4))
            console.log("Tag ids: " + question.tagIds) // this works correctly, no tags has blank tag ids
            if(question.tagIds.length <= 0) {
                return;
            }
            else {
            let temp = await dao.getTagsById(question.tagIds);
            console.log("temp: " + temp)
            setTags(temp);
            }
        }
        getData();
    }, []);
    return (
        <div className="question">
            <a href='' onClick={handleClick(question.qid)} className="postTitle">
                {question.title}
            </a>
            <div className="postStats">
                {question.answerCount} answers | {question.views} views | {question.votes} votes
            </div>
            <div className="summary">
                <TruncatedText text={question.text} maxLength={80} />
            </div>
            {tags.length > 0 && (
                <div className="pillContainer">
                    {tags.map((tag) => addTagPill(tag))}
                </div>
            )}
            <div className='lastActivity'>{metadataFormatter(question, "question")}</div>
        </div>
    );
}

export default Question;