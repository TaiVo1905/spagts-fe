import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4 absolute bottom-[48px] right-0 left-0">
      <button
        className="px-3 py-1 bg-(--text-color)/10 rounded hover:bg-(--text-color)/10 disabled:opacity-50"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaAngleDoubleLeft className='text-[16px] h-[24px]'/>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-(--primary-color) text-(--light-color)'
              : 'bg-(--text-color)/10 hover:bg-(--text-color)/5'
          }`}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-1 bg-(--text-color)/10 rounded hover:bg-(--text-color)/10 disabled:opacity-50"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaAngleDoubleRight className='text-[16px] h-[24px]'/>
      </button>
    </div>
  );
};

export default Pagination;
