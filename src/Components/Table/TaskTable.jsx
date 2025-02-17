import { useEffect, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import './index.css';
import StatusCell from './StatusCell';
import Filters from './Filters';
import DeleteIcon from './DeleteIcon';
import User from './User';
import { DATA } from './data';
import useCurrentScreenSize from './useCurrentScreenSize';
import ScreenSizeDisplay from '../../useCurrentScreenSize';
import IssueProfile from '../Model/IssueProfile';
import Modal from './Model';




const TaskTable = ({ DATA, pagination, setPagination, pageCount, totalUsers ,Update ,setUpdate}) => {

  const [data, setData] = useState(DATA);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedRowData, setselectedRowData] = useState(null)


console.log("Data in tasktable is")
console.log(DATA)

  // Function to remove selected rows
  const removeSelectedRows = async () => {
    console.log("Selected row data is:", selectedRows);

    // Extract customerServiceID from the selected rows
    const idsToDelete = Object.values(selectedRows).map(row => row._id); // Map to get only the IDs


    try {
      const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

      // Make a POST request to the server with the customerServiceIDs to delete
      const response = await fetch(`${url}/Support/delete`, {
        method: 'POST',  // Use POST for bulk deletion
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerServiceIDs: idsToDelete }), // Send only the IDs
      });

      if (!response.ok) {
        throw new Error('Failed to delete rows from server');
      }

      // Filter out the rows that were deleted
      const remainingData = data.filter((_, index) => !selectedRows[index]);
      setData(remainingData); // Update the local state
      setSelectedRows({}); // Clear selected rows

      alert("Rows deleted successfully");
    } catch (error) {
      alert("Error deleting rows:", error);
    }
  };


  const screenSize = useCurrentScreenSize();



  const getColumnSize = (baseSize) => {
    // Shrink column size for small screens
    if (screenSize === 'xxs' || screenSize === 'xs' || screenSize === 'sm') {
      return baseSize * 0.9; // Reduce size by 40% on small screens
    }
    return baseSize; // Default size for larger screens
  };

  // Define the columns based on the current screen size
  const columns = [
    {
      accessorKey: 'userId',
      header: 'User',
      cell: User,
      size: (screenSize === 'xxs' || screenSize === 'xs' || screenSize === 'sm') ? 20 : 200, // Dynamically adjust size
      enableColumnFilter: true,
    },


    // Conditionally include the Description column only on larger screens
    ...(screenSize !== 'xxs' && screenSize !== 'xs' && screenSize !== 'sm'
      ? [
        {
          accessorKey: 'issue',
          header: 'Issue',
          cell: (props) => <p className="poppins-semibold text-[#1a3048cc]">{props.getValue()}</p>,
          size: getColumnSize(80), // Dynamically adjust size
        },
      ]
      : ""), // Exclude Description column on small screens

    // Conditionally include the Description column only on larger screens
    ...(screenSize !== 'xxs' && screenSize !== 'xs' && screenSize !== 'sm'
      ?
      //  (console.log('Adding Description column for screen size:', screenSize),
      [
        {
          accessorKey: 'description',
          header: 'Description',
          cell: (props) => <p className="poppins-semibold text-[#1a3048cc]">{props.getValue()}</p>,
          size: getColumnSize(150),
        },
      ]
      : ""), // Exclude Description column on small screens
    {
      accessorKey: 'status',
      header: 'Status',
      cell: StatusCell,
      size: getColumnSize(150), // Dynamically adjust size
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },




  ];

  const table = useReactTable({
    data,
    manualPagination: true,
    columns,
    state: {
      rowSelection: selectedRows,
      pagination,
    },
    pageCount: pageCount,
    onRowSelectionChange: setSelectedRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    columnResizeMode: 'onChange',
    defaultColumn: { size: 10 },
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                ...prev[rowIndex],
                [columnId]: value,
              }
              : row
          )
        ),
    },
  });




  return (
    <>




      {/* Table Top NavBar */}


      <div className=''>
        {/* Render Table Headers */}
        <TableHeader table={table} />
        {/* Render Table Rows */}
        <TableRow table={table} selectedRows={selectedRows} setSelectedRows={setSelectedRows} setselectedRowData={setselectedRowData} />
        {/* BottomFooter of Table */}
        <TableFooter table={table} totalUsers={totalUsers} selectedRows={selectedRows} removeSelectedRows={removeSelectedRows} />

      </div>





      {selectedRowData && <Modal Update={Update} setUpdate={setUpdate} rowData={selectedRowData} onClose={() => setselectedRowData(null)} />}

    </>
  );
};


const TableRow = ({ table, selectedRows, setSelectedRows, setselectedRowData }) => {
  return (
    <div className='px-2 rounded-xl'>
      {table.getRowModel().rows.map((row) => (
        <div className="tr flex justify-center cursor-pointer" key={row.id}>
          <div className="td">
            <input
              type="checkbox"

              className="hidden md:block custom-checkbox"
              checked={selectedRows[row.index] !== undefined} // Check if the row is selected
              onChange={() => {
                setSelectedRows((prev) => {
                  const isSelected = prev[row.index] !== undefined; // Check if the row is already selected
                  const updatedRows = { ...prev };

                  if (isSelected) {
                    // If the row is selected, remove it
                    delete updatedRows[row.index];
                  } else {
                    // If the row is not selected, add the row data with the index
                    updatedRows[row.index] = row.original;
                  }

                  return updatedRows;
                });
              }}
            />
          </div>

          {row.getVisibleCells().map((cell) => (
            <div
              key={cell.id}
              onClick={(e) => { e.stopPropagation(); setselectedRowData(row.original); }}
              className="td"
              style={{ width: cell.column.getSize() }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};



const TableFooter = ({ table, selectedRows, removeSelectedRows, totalUsers }) => {


  return <>

    {Object.keys(selectedRows).length ? <div className='  '>

      <button
        onClick={() => { removeSelectedRows(); }}
        disabled={!Object.keys(selectedRows).length}
        className={`  p-2 px-4 rounded-2xl text-white   ${!Object.keys(selectedRows).length ? 'bg-red-500 opacity-50 cursor-not-allowed' : 'bg-red-500'}`}>
        Remove Selected Rows
      </button>
    </div> : ""}

    <div className='flex items-center justify-between poppins-semibold'>

      <div className='flex'>
        <h1 >Total Users</h1>
        <p className='text-black/50'>: {totalUsers}</p>
      </div>
      <div className="flex items-center space-x-4 justify-center ">


        <div className="flex   items-center space-x-4 justify-center ">
          <div
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`px-3 py-1 border border-gray-300 rounded-md text-gray-700 ${!table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : ''}`}>
            {'<'}
          </div>

          <p className="">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>

          <div
            onClick={(e) => { table.nextPage() }}
            disabled={!table.getCanNextPage()}
            className={`px-3 py-1 border border-gray-300 rounded-md text-gray-700 ${!table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : ''}`} >
            {'>'}
          </div>
        </div>
      </div>
    </div>

  </>
}

const TableHeader = ({ table, }) => {
  return <>

    <div className='px-2 bg-[#F7F8FA] mx-auto rounded-xl'>
      {table.getHeaderGroups().map((headerGroup) => (
        <div className="tr  flex justify-center" key={headerGroup.id}>
          <div className="th">
            <input

              type="checkbox"
              className='hidden md:block custom-checkbox'
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
          {headerGroup.headers.map((header) => (
            <div
              className="th"
              key={header.id}
              style={{ width: header.getSize() }}
            >
              {header.column.columnDef.header}

              <div
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>

  </>
}




export default TaskTable;
