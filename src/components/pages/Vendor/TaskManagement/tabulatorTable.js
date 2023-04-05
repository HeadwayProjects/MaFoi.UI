import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { getAuthToken } from "../../../../backend/auth";

/**
 *
 * @function getTabulatorTable
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

export const getTabulatorTable = (tableId, data, columns) => {
  const token = getAuthToken();
  var table = new Tabulator(tableId, {
    height: "100%",
    data: data,
    layout: "fitColumns",
    nestedFieldSeparator: "|",
    columns: columns,
    // paginationCounter: "rows",
    placeholder: "No Data Available",
    pagination: true, //enable pagination
    paginationMode: "remote", //enable remote pagination
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 15, 20],
    ajaxURL: "https://ezycompapi.azurewebsites.net/api/ToDo/GetToDoByCriteria", // TODO: to optimize
    ajaxConfig: {
      method: "POST",
      authorization: `Bearer ${token}`
    },
    // ajaxURLGenerator: function (url, config, params) {
    //   const { page, size } = params;
    //   return url + `?page=${page}&results=${size}`;
    // },
    ajaxResponse: function (url, params, response) {
      // Must configure with server side
      let last_page = 5;
      return {
        data: response,
        last_page,
      };
    }
  })
}