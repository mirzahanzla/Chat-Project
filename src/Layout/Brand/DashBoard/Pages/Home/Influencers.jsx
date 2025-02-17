import { useState } from 'react';
import SimpleCard from "../../../../../Components/Card/SimpleCard";
import './Index.css';

const Brands = ({ contracts }) => {
  let accepted = 0;
  let approved = 0;
  let invited = 0;

  // Check if contracts array has data
  const hasContracts = contracts && contracts.length > 0;

  contracts.forEach((contract) => {
    if (contract.milestones && Array.isArray(contract.milestones)) {
      contract.milestones.forEach((milestone) => {
        if (milestone.status === "Accepted") accepted += 1;
        if (milestone.status === "Invited") invited += 1;
        if (milestone.status === "Approved") approved += 1;
      });
    }
  });

  return (
    <div className="bg-white w-full mt-10 rounded-3xl" id='Influencers'>
      <div className="px-5 py-5 flex flex-col">
        <p className="lato-bold text-lg">Paid Contracts</p>
        <div className="mt-6">
          {/* Render a message if there's no data */}
          {!hasContracts ? (
            <p className="text-center mt-5">No Data to show yet!</p>
          ) : (
            <>
              <div className="mt-6 grid gap-x-8 gap-y-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 justify-center items-center">
                <SimpleCard name="Contracts" price={contracts.length} />
                <SimpleCard name="Approved" price={approved} />
                <SimpleCard name="Invited" price={invited} />
                <SimpleCard name="Accepted" price={accepted} />
              </div>
              <p className="lato-regular mt-12 ml-7">My Contracts Report</p>
              <div className="rounded-xl lato-regular text-[10px] mdm:text-base pt-3 mt-5 scroll-container">
                <div className="p-1 rounded-lg">
                  <div className="w-full grid grid-cols-12 gap-x-8 auto-rows-fr text-center border-b-2 pt-5 pb-3 border-t-2">
                    <div className="col-span-3 text-center">
                      <p className="lato-bold text-lg">Influencer</p>
                    </div>
                    <div className="col-span-1">
                      <p className="lato-bold text-lg">%ER</p>
                    </div>
                    <div className="col-span-2">
                      <p className="lato-bold text-lg">Budget</p>
                    </div>
                    <div className="col-span-2">
                      <p className="lato-bold text-lg">Category</p>
                    </div>
                    <div className="col-span-2">
                      <p className="lato-bold text-lg">Status</p>
                    </div>
                  </div>
                  {contracts.slice(0, 3).map((contract, index) => (
                    <TableRows
                      key={index}
                      name={contract.influencerName}
                      img={contract.influencerPhoto}
                      Er={contract.dealEngagementRate}
                      Budget={contract.milestones.reduce(
                        (total, milestone) =>
                          total + (milestone.budget || 0),
                        0
                      )}
                      category={contract.dealCategory}
                      Status={contract.milestones[contract.milestones.length - 1].status} // the last status is representative
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TableRows = ({ name, img, Er, Budget, category, Status }) => {
  return (
    <div className="w-full grid grid-cols-12 auto-rows-fr text-center mt-5 gap-x-8 border-b-2 pb-2">
      <div className="col-span-3 text-center">
        <div className="flex items-center justify-center gap-x-3">
          <img className='size-[35px] Avatar' src={img} alt={name} />
          <p>{name}</p>
        </div>
      </div>
      <div className="col-span-1">
        <p className="p-1">{Er}%</p>
      </div>
      <div className="col-span-2">
        <p className="p-1">${Budget}</p>
      </div>
      <div className="col-span-2">
        <p className="p-1">{category}</p>
      </div>
      <div className="col-span-2 pr-2">
        <p className="p-1">{Status}</p>
      </div>
    </div>
  );
};

export default Brands;