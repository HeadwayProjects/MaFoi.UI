import { TabulatorFull as Tabulator } from 'tabulator-tables';

/**
 *
 * @function getToDoTable
 *
 *    This function will get the table id , data and columns and returns Tabulator Table.
 *
 *    @param tableId
 *    @param data
 *    @param columns
 *
 *    @returns Tabulator Table
 *
 */

export const getToDoTable = (tableId, data, columns) => {
  console.log(data, columns)
  var table = new Tabulator(tableId, {
    height: "100%",
    data: data,
    layout: "fitColumns",
    columns: columns,
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 15, 20],
    paginationCounter: "rows",
    placeholder: "No Data Available"
  })
}