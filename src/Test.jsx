import { useState } from 'react';
import Company from './Components/Svg/Company';
import UserIcon from './Components/Svg/UserIcon';

const Stepper = () => {
  const [stepperIndex, setStepperIndex] = useState(0);

  const steps = [
    { icon: <UserIcon color={stepperIndex >= 0 ? 'white' : 'black'} />, label: 'Basic Details' },
    { icon: <Company color={stepperIndex >= 1 ? 'white' : 'black'} />, label: 'Company Details' },
    { icon: <Company color={stepperIndex >= 2 ? 'white' : 'black'} />, label: 'Education Details' },
    { icon: <Company color={stepperIndex >= 3 ? 'white' : 'black'} />, label: 'Payment Details' },
  ];

  const stepperHandler = (index) => {
    setStepperIndex(index);
  };

  const nextStep = () => {
    if (stepperIndex < steps.length - 1) {
      stepperHandler(stepperIndex + 1);
    }
  };

  const prevStep = () => {
    if (stepperIndex > 0) {
      stepperHandler(stepperIndex - 1);
    }
  };

  return (
    <div className="poppins-semibold borderRed w-[1000px]">
      <div className="stepper">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step ${i === stepperIndex ? 'active' : ''} ${i < stepperIndex ? 'completed' : ''}`}
          >
            <div className="stepDetails">
              {step.icon}
              <span>{step.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="btnContainer">
        <button onClick={prevStep} id="prevbtn">Back</button>
        <button onClick={nextStep} id="nextbtn">Next</button>
      </div>
    </div>
  );
};

export default Stepper;
