import { useState, useEffect, useRef } from "react";
import { STATUSES } from "./data";
import { ColorIcon } from "./StatusCell";
import { FilterIcon } from "./FilterIcon";

const StatusItem = ({ status, setColumnFilters, isActive }) => (
  
  <div
    className={`flex items-center cursor-pointer rounded-lg font-bold py-2 sm:p-2 ${isActive ? "text-orange-500" : "bg-transparent"
      } hover:text-orange-500`}
    onClick={() =>
      setColumnFilters((prev) => {
        const statuses = prev.find((filter) => filter.id === "status")?.value;
        if (!statuses) {
          return prev.concat({
            id: "status",
            value: [status.id],
          });
        }

        return prev.map((f) =>
          f.id === "status"
            ? {
              ...f,
              value: isActive
                ? statuses.filter((s) => s !== status.id)
                : statuses.concat(status.id),
            }
            : f
        );
      })
    }
  >
    <ColorIcon color={status.color} className="mr-3" />
    {status.name}
  </div>
);

const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterStatuses =
    columnFilters.find((f) => f.id === "status")?.value || [];
  const popoverRef = useRef(null);

  // Function to close the popover if clicked outside
  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative " ref={popoverRef}>
      <div className="flex">
        {/* <img src="/Svg/Filter.svg" alt="" /> */}
        <FilterIcon color={isOpen ? "#f97316" : "black"} />
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center poppins-regular text-[13px] ${isOpen || filterStatuses.length > 0
              ? "text-orange-500"
              : "text-gray-700"
            }`}
        >
          Filter
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-full  mt-2  w-[80px] mdm:w-60 bg-white border-2 border-orange-500 text-black rounded-lg shadow-lg z-20">
          <div className="p-1 sm:p-4">
            <div className="font-bold text-gray-400 mb-1">Status</div>
            <div className="space-y-1">
              {STATUSES.map((status) => (
                <StatusItem
                  status={status}
                  isActive={filterStatuses.includes(status.id)}
                  setColumnFilters={setColumnFilters}
                  key={status.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
