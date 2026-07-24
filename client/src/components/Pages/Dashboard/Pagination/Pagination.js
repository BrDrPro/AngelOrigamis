import React from 'react';

const PAGE_SIZE = 10;

export function usePagination(items) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return { page: safePage, setPage, totalPages, pageItems };
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Anterior
      </button>
      <span className="pagination-info">Página {page} de {totalPages}</span>
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Próxima →
      </button>
    </div>
  );
}

export default Pagination;
