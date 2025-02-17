import Card from "../../../../../Components/Card/Card";
import CardWithImage from "../../../../../Components/Card/CardWithImage";
import SimpleCard from "../../../../../Components/Card/SimpleCard";
import SimpleAreaChart from "../../../../../Components/Charts/SimpleAreaChart";
import SimpleBarChart from "../../../../../Components/Charts/SimpleBarChart";
import './Index.css';

const Spendings = ({ budgetSpent, contracts }) => {
  // Get the last 6 months in 'YYYY-MM' format
  const budgets = Array(6).fill(0); // Initialize an array to hold the budget for the last 6 months
  const currentMonth = new Date();

  // Iterate over the last 6 months
  for (let i = 0; i < 6; i++) {
    // Get currentMonth in 'YYYY-MM' format
    currentMonth.setMonth(currentMonth.getMonth() - i);
    const monthStr = currentMonth.toISOString().slice(0, 7);

    // Iterate over contracts
    contracts.forEach(contract => {
      if (contract.milestones && Array.isArray(contract.milestones)) {
        contract.milestones.forEach(milestone => {
          const milestoneMonthYear = milestone.startedDate.slice(0, 7); // Extract 'YYYY-MM' from startedDate
          
          // Check if the milestone is in the current month being iterated
          if (milestoneMonthYear === monthStr) {
            budgets[i] += milestone.budget || 0; // Update the budget for that month
            console.log("budget: ", budgets[i])
          }
        });
      }
    });
  }

  // Calculate total budget over the last 6 months
  const totalBudgetSpentLast6Months = budgets.reduce((total, budget) => total + budget, 0);
  console.log("Budget for 6 months: ", totalBudgetSpentLast6Months);

  return (
    <div className="bg-white w-full mt-10 rounded-3xl" id="Spendings">
      <div className="px-5 py-5 flex flex-col">
        <p className="lato-bold text-lg">Spendings</p>

        <div className="lg:flex lg:items-center">
          {/* Card with image for Budget Spent */}
          <div>
            <CardWithImage
              Heading="Budget Spent"
              totalNumbers={budgetSpent.currentMonth}
              Percentage={budgetSpent.change}
              time="Last Month"
              ImageSource="card2.png"
            />
          </div>

          {/* Budget Spent section */}
          <div className="w-full border-2 mt-10 md:border-none md:mt-0">
            <div className="flex justify-between w-[200px] mx-auto mb-5">
              <div className="text-center">
                <p className="lg:text-2xl lato-bold">${totalBudgetSpentLast6Months}</p> {/* Display total budget spent */}
                <p>Budget Spent on Marketing (Last 6 Months)</p>
              </div>
            </div>
            <div className="w-full h-[200px] overflow-scroll scroll-container">
              <div className="w-[900px] h-full md:w-full">
                <SimpleAreaChart budgets={budgets} /> {/* Pass budgets to the chart component */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spendings;