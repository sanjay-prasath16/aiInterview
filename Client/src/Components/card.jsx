import PropTypes from "prop-types";

const Card = ({ index, candidate }) => {
  const generateDots = (progress) => {
    const totalDots = 10;
    const fullDotsCount = Math.floor((progress / 100) * totalDots);
    const hasHalfDot = progress % 10 >= 5;

    return Array.from({ length: totalDots }, (_, index) => {
      if (index < fullDotsCount) {
        return {
          background: "#9333ea",
          boxShadow: "0px 0px 8px rgba(147, 51, 234, 0.4)",
        };
      }
      if (index === fullDotsCount && hasHalfDot) {
        return {
          background:
            "linear-gradient(to top left, #6b21a8, #9333ea, rgba(147, 51, 234, 0.2), #d9d9d9)",
          boxShadow: "0px 0px 8px rgba(147, 51, 234, 0.3)",
        };
      }
      return { background: "#d9d9d9" };
    });
  };

  const getDotPosition = (index, radius = 31) => {
    const angle = ((2.5 - index) / 10) * 2 * Math.PI;
    return {
      left: `${Math.round(radius + radius * Math.cos(angle))}%`,
      top: `${Math.round(radius - radius * Math.sin(angle))}%`,
    };
  };

  return (
    <div 
      className={`w-full md:w-[45%] lg:w-[30%] border-[#0B0C18] bg-[#0B0C18] rounded-xl p-[21px] shadow-lg mb-10 ${index === 2 ? "mx-5" : "mx-3"} ${index !== 0 && index !== 3 ? "ml-10" : ""}`}
      style={{ direction: "ltr" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0px 4px 3px rgba(147, 51, 234, 0.3)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div className="flex">
        <img
          src={candidate.src}
          alt={candidate.name}
          className="w-12 h-12 rounded-full shadow-inner"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <p className="text-[17px] font-medium text-white">{candidate.name}</p>
            <p className="text-xs text-gray-400">
              Applied {candidate.appliedDaysAgo} days ago
            </p>
          </div>
          <p className="text-[#A5A5A7]">
            {candidate.title}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-4 pt-4 relative">
        <div className="flex justify-between">
          {candidate.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="relative text-center">
              <div className="flex justify-center ml-[10px] mb-[23px]">
                <p className="mt-2 text-[10px] font-semibold text-[#656565]">
                  {round.name}
                </p>
              </div>
              <div className="relative w-[63px] h-[61px] mx-auto">
                {generateDots(round.progress).map((style, index) => (
                  <div
                    key={index}
                    className="absolute w-[12px] h-[12px] rounded-full"
                    style={{
                      ...style,
                      ...getDotPosition(index, 50),
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center ml-[10px] mt-[15px]">
                  <p className="font-bold text-[#767676]">
                    {round.progress}%
                  </p>
                </div>
              </div>
              <p className="text-[#656565] mt-[23px] ml-[10px]">{round.description}</p>
            </div>
          ))}
          <div className="flex flex-col justify-end">
            <p className="text-[40px] text-[#9333ea] font-semibold mb-[25%]">86%</p>
            <p className="font-semibold text-white">Cumulative score</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-[9px]">
        <p className="font-medium text-purple-600 border border-purple-600 rounded-full p-[10px] cursor-pointer">View more</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  index: PropTypes.number.isRequired,
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    appliedDaysAgo: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    rounds: PropTypes.arrayOf(
      PropTypes.shape({
        progress: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Card;