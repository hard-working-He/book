import Link from "next/link";

export function Pagination(props: {
  pagination: {
    page: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  pathname: string;
  query: Record<string, string | undefined>;
}) {
  const makeHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(props.query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    params.set("page", String(page));
    return `${props.pathname}?${params.toString()}`;
  };

  return (
    <div className="between" style={{ marginTop: 28 }}>
      <span className="muted">
        第 {props.pagination.page} / {props.pagination.totalPages} 页
      </span>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Link
          href={props.pagination.hasPrev ? makeHref(props.pagination.page - 1) : "#"}
          className="btn btn-secondary"
          aria-disabled={!props.pagination.hasPrev}
        >
          上一页
        </Link>
        <Link
          href={props.pagination.hasNext ? makeHref(props.pagination.page + 1) : "#"}
          className="btn btn-primary"
          aria-disabled={!props.pagination.hasNext}
        >
          下一页
        </Link>
      </div>
    </div>
  );
}
