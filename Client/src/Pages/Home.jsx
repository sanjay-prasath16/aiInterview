import Navbar from "../Components/Navbar";
import Analysis from '../assets/homeAnalysis.svg';
import Progress from '../assets/homeProgress.svg';
import Feedback from '../assets/homeFeedback.svg';
import { FaArrowRight } from "react-icons/fa6";

const AfterSelection = () => {
  return (
    <div className="h-screen w-screen bg-[#040109] flex flex-col">
      <Navbar />
      <div className="text-white">
        <div className="flex flex-col w-full items-center mt-[3%]">
          <p className="text-[55px] font-bold">Master Your Interview</p>
          <p className="text-purple-600 text-[55px] font-bold -mt-[0.8%]">With AI</p>
          <p className="text-[14px] mt-[0.5%]">Practice interviews with our advanced AI system. Get real-time</p>
          <p className="text-[14px]">feedback and improve your skills.</p>
        </div>
        <div className="flex mt-[4%]">
          <div className="mx-[5%] w-[23%] bg-[#090C14] p-[2%] rounded-2xl" style={{ border: '1px solid #151027' }}>
            <img src={Analysis} alt="" className="w-[10%] mb-[1%]" />
            <p className="text-[22px] font-bold mb-[6%]">Smart Analysis</p>
            <p className="text-[#89A3AF] text-[14px]">Advanced AI algorithms analyze your responses and provide detailed feedback.</p>
          </div>
          <div className="mx-[5%] w-[23%] bg-[#090C14] p-[2%] rounded-2xl" style={{ border: '1px solid #151027' }}>
            <img src={Progress} alt="" className="w-[10%] mb-[1%]" />
            <p className="text-[22px] font-bold mb-[6%]">Progress Tracking</p>
            <p className="text-[#89A3AF] text-[14px]">Monitor your improvement over time with detailed performance metrics.</p>
          </div>
          <div className="mx-[5%] w-[23%] bg-[#090C14] p-[2%] rounded-2xl" style={{ border: '1px solid #151027' }}>
            <img src={Feedback} alt="" className="w-[10%] mb-[1%]" />
            <p className="text-[22px] font-bold mb-[6%]">Real-time Feedback</p>
            <p className="text-[#89A3AF] text-[14px]">Get instant feedback on your answers, body language, and speaking pace.</p>
          </div>
        </div>
        <div className="mt-[4%] w-[70%] flex justify-between text-center justify-self-center">
          <div>
            <p className="text-[45px] font-bold text-purple-600">500+</p>
            <p className="text-[14px]">Interview Questions</p>
          </div>
          <div>
            <p className="text-[45px] font-bold text-purple-600">98%</p>
            <p className="text-[14px]">Accuracy Rate</p>
          </div>
          <div>
            <p className="text-[45px] font-bold text-purple-600">24/7</p>
            <p className="text-[14px]">Availability</p>
          </div>
        </div>
        <a 
          className="fixed bottom-6 right-10 bg-purple-800 text-white font-bold py-5 px-6 rounded-xl animate-bounce hover:animate-none hover:translate-y-0 hover:shadow-lg flex whitespace-nowrap cursor-pointer"
          href="/firstRound"
        >
          Analyze Yourself Now
          <FaArrowRight className="text-[17px] ml-[4%]" />
        </a>
      </div>
    </div>
  );
};

export default AfterSelection;