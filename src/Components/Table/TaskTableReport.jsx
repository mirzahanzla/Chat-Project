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
import { DATA } from './data';
import useCurrentScreenSize from './useCurrentScreenSize';
import ScreenSizeDisplay from '../../useCurrentScreenSize';
import IssueProfile from '../Model/IssueProfile';
import Modal from './Model';
import Brand from './brand';
import PaymentModel from './PaymentModel';
import InfluencerModel from './InfluencerModel';
import WithDrawModel from './WithDrawModel';
import UserReport from './UserReport';
import UpdateReport2 from './UpdateReport2';




const TaskTableReport = ({ DATA, pagination, setPagination, pageCount, totalUsers ,Update ,setUpdate}) => {

  console.log("data is Influencer")
  console.log(DATA )
  const [data, setData] = useState(DATA);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedRowData, setselectedRowData] = useState(null)




 

  const screenSize = useCurrentScreenSize();




  // Define the columns based on the current screen size
  const columns = [
    {
      accessorKey: 'Name',
      header: 'Influencer ',
      cell: UserReport,
      size: (screenSize === 'xxs' || screenSize === 'xs' || screenSize === 'sm') ? 20 : 200, // Dynamically adjust size
      enableColumnFilter: true,
    },
    {
      accessorKey: 'NoOfPosts',
      header: 'Total Posts ',
      cell: UserReport,
      size: (screenSize === 'xxs' || screenSize === 'xs' || screenSize === 'sm') ? 20 : 200, // Dynamically adjust size
      enableColumnFilter: true,
    },
    {
      accessorKey: 'AvgEngagementRate',
      header: 'Engagement Rate',
      cell: ({ getValue }) => {
        // Log the value for debugging purposes
        console.log("Value is: ", getValue());
      
        // Return the JSX element
        return (
          <div className='flex my-3 text-[9px] sm:text-[10px] mdm:text-[12px] w-[150px]'>
            <div className='flex flex-1 flex-col ml-2'>
              <div className='flex text-center'>
                <p className='poppins-regular w-full text-center'>
                  {getValue().toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        );
      }
      
      
,      
      size: (screenSize === 'xxs' || screenSize === 'xs' || screenSize === 'sm') ? 20 : 200, // Dynamically adjust size
      enableColumnFilter: true,
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
        {/* <TableFooter table={table} totalUsers={totalUsers} selectedRows={selectedRows} /> */}

      </div>





      {selectedRowData && <UpdateReport2  rowData={selectedRowData} onClose={() => setselectedRowData(null)} />}

    </>
  );
};


const TableRow = ({ table, selectedRows, setSelectedRows, setselectedRowData }) => {
  return (
    <div className='px-2 rounded-xl'>
      {table.getRowModel().rows.map((row) => (
        <div className="tr flex  cursor-pointer" key={row.id}>
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





const TableHeader = ({ table, }) => {
  return <>

    <div className='px-2 bg-[#F7F8FA] mx-auto rounded-xl'>
      {table.getHeaderGroups().map((headerGroup) => (
        <div className="tr  flex " key={headerGroup.id}>
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




export default TaskTableReport;
