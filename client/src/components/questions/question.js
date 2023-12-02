import React, { useEffect, useState } from 'react';
import TagPill from './tagPill';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import { metadataFormatter } from '../metadataFormatter';

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

        return function(event) {
            dao.incrementViewCount(qid)
            event.preventDefault();
            setPageAndParams("answers", {qid});
        }
    }
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const getData = async () => { 
            let temp = await dao.getTagsById(question.tagIds);
            setTags(temp);
        }
        getData();
    }, []);
    return (
        <div className="question">
            <a href='#content' onClick={handleClick(question.qid)} className="postTitle">{question.title}</a>
            <div className="postStats">
                {question.ansIds.length} answers | {question.views} views
            </div>
            <div className="pillContainer">
                {tags.map((tag) => addTagPill(tag))}
            </div>
            <div className='lastActivity'>{metadataFormatter(question, "question")}</div>
        </div>
    )
}

export default Question;