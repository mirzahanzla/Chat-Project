import UserIcon from '../../Components/Svg/UserIcon';
import Company from '../../Components/Svg/Company';
import Tick from '../../Components/Svg/Tick';

const NavBar = ({ stepperIndex,  check = true }) => {
  const steps = check ? [
    { icon: <UserIcon color={stepperIndex >= 0 ? 'white' : 'black'} />, label: 'Basic Details' },
    { icon: <Company color={stepperIndex >= 1 ? 'white' : 'black'} />, label: 'Company Details' },
    { icon: <Tick color={stepperIndex >= 2 ? 'white' : 'black'} />, label: 'Submit' },
  ] : [
    { icon: <UserIcon color={stepperIndex >= 0 ? 'white' : 'black'} />, label: 'Basic Details' },
    { icon: <Tick color={stepperIndex >= 2 ? 'white' : 'black'} />, label: 'Submit' },
  ]

  return (
    <div className="poppins-semibold  text-[4px] md:text-[10px]">
      <div className="stepper">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step    mdm:text-[12px] ${i === stepperIndex ? 'active' : ''} ${i < stepperIndex ? 'completed' : ''}`}
          
          >
            <div className="  stepDetails  sm:px-5 xs:px-4 text-[6px] sm:text-[7px]  mdm:text-[10px]">
              <div >{step.icon}</div>
              <span>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
