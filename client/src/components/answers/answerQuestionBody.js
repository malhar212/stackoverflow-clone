import React, { useEffect, useState } from 'react';
import './stylesheets/answers.css'
import { metadataFormatter } from '../metadataFormatter';
import HyperLinkParser from '../hyperlinkParser';
import TagPill from '../questions/tagPill';
import { DataDao } from '../../models/ModelDAO';
import VoteComponent from '../voteComponent';
import CommentsComponent from '../comments/commentsComponent';
import { OBJECT_TYPES } from '../../models/enums';

// Create Individual Tag in each Question
function addTagPill(tag) {
    return <TagPill
        key={tag.tid}
        name={tag.name}
    />
}

// Display Question Information
function AnswerQuestionBody(props) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const getData = async () => {
            let temp = await DataDao.getInstance().getTagsById(props.question.tagIds);
            setTags(temp);
        }
        getData();
    }, []);
    return (
        <><div id='questionBody'>
            <div className='questionText'> <HyperLinkParser text={props.question.text} /> </div>
            <div className='questionMetadata'>
                {metadataFormatter(props.question, OBJECT_TYPES.QUESTION)}
            </div>
            <VoteComponent initialCount={props.question.votes} parentId={props.question.qid} parent={OBJECT_TYPES.QUESTION}/><span id="questionViews">{props.question.views} views</span>
            <div className="pillContainer">
                {tags.map((tag) => addTagPill(tag))}
            </div>
            <hr></hr>
            <CommentsComponent associatedType={OBJECT_TYPES.QUESTION} associatedId={props.question.qid} />
        </div>
        </>
    )
}


export default AnswerQuestionBody;






