import React, { useState } from 'react';

const PaginationComponent = ({ items, itemsPerPage, renderItem }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let accepted = false;
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    console.log("in pagination!==================")

    const getPaginatedItems = () => {
        let nonAcceptedItems = [...items];
        let perPage = itemsPerPage;
        if (items[0].accepted) {
            accepted = true;
            nonAcceptedItems = [...items].slice(1);
            perPage = perPage - 1;
        }
        const startIndex = (currentPage - 1) * perPage;
        let pageItems = nonAcceptedItems.slice(startIndex, startIndex + perPage);
        return (items[0].accepted) ? [items[0], ...pageItems] : pageItems;
    };


    const currentItems = getPaginatedItems();

    console.log(currentItems);

    const handlePrevClick = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextClick = () => {
        if (currentPage === totalPages) {
            setCurrentPage(1);
        } else {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div>
            {/* Display items */}
            {currentItems.map((item, index) => (
                <div key={index}>{renderItem(item, accepted)}</div>
            ))}

            {/* Pagination controls */}
            <div className='paginationControls'>
                <button onClick={handlePrevClick} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextClick} disabled={totalPages === 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationComponent;
