import * as React from "react";
import { Alert, Input } from "react-daisyui";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import classnames from "classnames";
import ErrorIcon from "ui/icons/ErrorIcon";

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <Input
      className="w-full"
      size="sm"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}

export interface TableProps {
  isLoading?: boolean;
  error?;
  columns?;
  data?;
  className?;
  isPageTable?;
  emptyHeader?;
  errorText?: React.ReactNode;
  emptyAction?: React.ReactNode;
  initialState?;
}

function UnstyledTable({
  isLoading = false,
  error = null,
  columns,
  data,
  emptyHeader = "There's nothing here.",
  emptyAction = "Create a new thing and it will show up here.",
  errorText = "An error occurred",
  initialState,
}: TableProps) {
  const filterTypes = React.useMemo(
    () => ({
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: data || [],
      filterTypes,
      defaultColumn,
      initialState: { pageSize: 25, ...initialState },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleChangePage = (_, page) => gotoPage(page);
  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    gotoPage(0);
  };

  if (error) {
    console.error(error);
  }

  // Render the UI for your table
  return (
    <>
      <table className="table table-fixed  w-full" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="tableHeaderCell"
                  {...column.getHeaderProps(
                    {
                      className: column.className,
                      style: column.style,
                    },

                    column.getSortByToggleProps()
                  )}
                >
                  <div className="sortableHeaderContainer">
                    <div>{column.render("Header")}</div>
                    {column.canSort && (
                      <div className={"sortingSwitch"}>
                        <div
                          className={classnames("sortingTicker", {
                            sortingTickerActive: column.isSortedDesc === false,
                            sortingTickerInactive: column.isSortedDesc,
                          })}
                        >
                          {/* <ArrowDropUpIcon fontSize="small" /> */}
                        </div>
                        <div
                          className={classnames("sortingTicker", {
                            sortingTickerActive: column.isSortedDesc === true,
                            sortingTickerInactive: column.isSortedDesc === false,
                          })}
                        >
                          {/* <ArrowDropDownIcon fontSize="small" /> */}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        size="small"
                        {...cell.getCellProps({
                          className: cell.column.className,
                          style: cell.column.style,
                        })}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              )
          )}
          {!isLoading && rows.length === 0 && !error && (
            <tr>
              <td colSpan={columns?.length}>
                <div className={"emptyMessage"}>
                  <h1 className="emptyHeader">{emptyHeader}</h1>
                  <h2 className="emptyAction">{emptyAction}</h2>
                </div>
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={columns?.length}>
                <div className={"emptyMessage"}>
                  <h1>Loading</h1>
                </div>
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={columns?.length}>
                <div className={"emptyMessage"}>
                  <Alert
                    status="error"
                    icon={<ErrorIcon className="w-6 h-6 mx-2 stroke-current" />}
                  >
                    {errorText}
                  </Alert>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </>
  );
}

export const Table = UnstyledTable;
