import React, { useState } from 'react';

const PaginationComponent = ({ items, itemsPerPage, renderItem }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

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
                <div key={index}>{renderItem(item)}</div>
            ))}

            {/* Pagination controls */}
            <button onClick={handlePrevClick} disabled={currentPage === 1}>
                Prev
            </button>
            <span>Page {currentPage}</span>
            <button onClick={handleNextClick}>
                Next
            </button>
        </div>
    );
};

export default PaginationComponent;
