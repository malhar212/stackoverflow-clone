import React, { useContext } from 'react';
import { useLocationContext } from './locationContext';
import { SearchTextContext } from './searchTextContext';

// Static Side-bar Navigation component
function SideNavBar() {
    const { page, setPageAndParams } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);

    // if the location (the url params) are question or tags, then add highlighting className to that element
    var questionsStyle = "active";
    var tagsStyle = "active";
    
    page == "questions" ? questionsStyle = "active" : questionsStyle = "";
    page == "tags" ? tagsStyle = "active" : tagsStyle = "";

    function handleClick(newpage) {
        return function (event) {
            event.preventDefault();
            if (newpage === 'questions')
                setSearchQuery('');
            setPageAndParams(newpage, {x: new Date()});
        }
    }

    return (
        <div id='sideBarNav' className='sideNav'>
            <a className={questionsStyle} href='' onClick={handleClick('questions')}>Questions</a>
            <a className={tagsStyle} href='' onClick={handleClick('tags')}>Tags</a>
        </div>
    )
}


export default SideNavBar;