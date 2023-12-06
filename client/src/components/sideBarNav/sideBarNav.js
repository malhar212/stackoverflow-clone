import React, { useContext } from 'react';
import { useLocationContext } from '../locationContext';
import { SearchTextContext } from '../searchTextContext';
import './stylesheets/sideBarNav.css'
import { DataDao } from '../../models/ModelDAO';

// Static Side-bar Navigation component
function SideNavBar() {
    const { page, setPageAndParams, loggedIn, setLoggedIn } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);

    // if the location (the url params) are question or tags, then add highlighting className to that element
    var questionsStyle = "active";
    var tagsStyle = "active";
    var profileStyle = "active";
    
    page == "questions" ? questionsStyle = "active" : questionsStyle = "";
    page == "tags" ? tagsStyle = "active" : tagsStyle = "";
    page == "profile" ? profileStyle = "active" : profileStyle = "";
    console.log(loggedIn);
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
            { loggedIn ? <a className={profileStyle} href='' onClick={handleClick('profile')}>Profile</a> : <></> }
            { loggedIn ? <a className={profileStyle} href='' onClick={async (e) => {e.preventDefault(); setLoggedIn(false); await DataDao.getInstance().logout(); setPageAndParams('welcome', {})}}>Logout</a> : <a href='' onClick={handleClick('welcome')}>Login</a> }
        </div>
    )
}


export default SideNavBar;