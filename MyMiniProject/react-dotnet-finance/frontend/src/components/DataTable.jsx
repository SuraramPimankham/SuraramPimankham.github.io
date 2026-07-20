import { useState } from 'react'

/** Shared Stripe-style data table shell */
export default function DataTable({
  title,
  children,
  actions = null,
  filters = null,
  filterActions = null,
  /** CSS grid-template-columns; default = 12-col system */
  filterColumns = 'repeat(12, minmax(0, 1fr))',
  filtersDefaultOpen = true,
}) {
  const [filtersOpen, setFiltersOpen] = useState(filtersDefaultOpen)
  const showHead = title || actions || filters

  return (
    <section className="panel panel--table">
      {showHead && (
        <div className="panel__head">
          {(title || actions || filters) && (
            <div className="panel__head-top">
              {title ? <h2>{title}</h2> : <span />}
              <div className="panel__head-actions">
                {filters ? (
                  <button
                    type="button"
                    className="btn ghost data-table__filter-toggle"
                    onClick={() => setFiltersOpen((o) => !o)}
                    aria-expanded={filtersOpen}
                  >
                    {filtersOpen ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
                  </button>
                ) : null}
                {actions}
              </div>
            </div>
          )}
          {filters && filtersOpen ? (
            <div className="data-table__filters" style={{ gridTemplateColumns: filterColumns }}>
              {filters}
              {filterActions ? (
                <div className="data-table__filter-actions g-span-full">{filterActions}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      <div className="data-table">{children}</div>
    </section>
  )
}
