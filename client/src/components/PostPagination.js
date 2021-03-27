import React from "react";

let totalPages;

const PostPagination = ({ page, setPage, postCount }) => {
  const pagination = () => {
    totalPages = Math.ceil(postCount && postCount.totalPosts / 3);
    if (totalPages > 10) totalPages = 10;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            className={`page-link ${page === i && "activePagination"}`}
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li>
          <button
            className={`page-link ${page === 1 && "disabled"}`}
            onClick={() => setPage(1)}
          >
            First
          </button>
        </li>

        {pagination()}
        <li>
          <button
            className={`page-link ${page === totalPages && "disabled"}`}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PostPagination;
