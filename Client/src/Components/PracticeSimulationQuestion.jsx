import smallJupitericon from "../assets/smallJupiter.png";
import PropTypes from "prop-types";

const PracticeSimulationQuestion = ({ onSmallJupiterClick, question, example }) => {
  return (
    <div className="w-[95%] h-full flex flex-col bg-transparent pl-5 text-red-700">
      <div className="flex h-[50%] relative">
        <div className="relative flex-grow">
          <div className="p-5 pl-10 rounded-[30px] questionBox relative overflow-hidden">
            <div className="absolute inset-0 rounded-[30px] bg-black opacity-[50%] cutout-box"></div>
            <div className="relative z-10 flex flex-col">
              <div className="absolute -top-5 -right-5 flex items-end">
                <img
                  className="relative h-[60px] w-[60px] cursor-pointer"
                  src={smallJupitericon}
                  alt=""
                  onClick={onSmallJupiterClick}
                />
              </div>
              <div className="text-[24px] pb-4 font-bold text-white">
                <h1>Question</h1>
              </div>
              <div className="mr-10 text-[16px] text-base leading-[22px] text-justify text-white">
                <p>{question}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[45%] flex-col rounded-[30px]">
        <div className="relative flex-grow">
          <div className="absolute inset-0 rounded-[30px] bg-[#3E3B41] opacity-[40%]"></div>
          <div className="relative z-10 flex flex-col pl-10 pr-10">
            <div className="flex">
              <h1 className="text-[24px] pt-[2rem] pb-[2rem] text-white">
                Example:
              </h1>
            </div>
            <div className="flex flex-col text-[16px] text-base leading-[22px] text-white">
              <div className="flex pb-[2rem]">
                <p>{example}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PracticeSimulationQuestion.propTypes = {
  onSmallJupiterClick: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  example: PropTypes.string.isRequired,
};

export default PracticeSimulationQuestion;