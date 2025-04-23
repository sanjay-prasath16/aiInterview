import { useState } from "react";
import Sanjay from "../assets/sanjay.jpeg";
import Mukesh from "../assets/mukesh.jpeg";
import Debaleena from "../assets/debaleena.jpg";
import Manjeet from "../assets/manjeet.jpeg";
import Priyansh from "../assets/priyansh.jpg";
import Bieden from "../assets/bieden.jpeg";
import Joe from "../assets/joe.jpeg";
import Rajan from "../assets/rajan.jpg";
import Card from "../Components/card";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import ReactPaginate from "react-paginate";
import Navbar from "../Components/Navbar";

const ApplicantResult = () => {
  const candidates = [
    {
      name: "Sanjay Prasath",
      title: "B.E. CSE",
      location: "India",
      experience: 12,
      appliedDaysAgo: 15,
      src: Sanjay,
      rounds: [
        { progress: 85, name: "Round 1", description: "Communication" },
        { progress: 95, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Mukesh",
      title: "B.E. AIDS",
      location: "America",
      experience: 6,
      appliedDaysAgo: 13,
      src: Mukesh,
      rounds: [
        { progress: 20, name: "Round 1", description: "Communication" },
        { progress: 35, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Debaleena",
      title: "B.TECH. IT",
      location: "Austin",
      experience: 8,
      appliedDaysAgo: 10,
      src: Debaleena,
      rounds: [
        { progress: 60, name: "Round 1", description: "Communication" },
        { progress: 90, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Manjeet",
      title: "B.E. ECE",
      location: "Chicago",
      experience: 12,
      appliedDaysAgo: 1,
      src: Manjeet,
      rounds: [
        { progress: 60, name: "Round 1", description: "Communication" },
        { progress: 75, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Priyansh",
      title: "B.E. EEE",
      location: "Boston",
      experience: 12,
      appliedDaysAgo: 7,
      src: Priyansh,
      rounds: [
        { progress: 45, name: "Round 1", description: "Communication" },
        { progress: 88, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Joe",
      title: "B.E.MECH",
      location: "Seattle",
      experience: 4,
      appliedDaysAgo: 3,
      src: Joe,
      rounds: [
        { progress: 55, name: "Round 1", description: "Communication" },
        { progress: 90, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Bieden",
      title: "B.E. AGRI",
      location: "Bieden",
      experience: 6,
      appliedDaysAgo: 4,
      src: Bieden,
      rounds: [
        { progress: 35, name: "Round 1", description: "Communication" },
        { progress: 75, name: "Round 2", description: "Technical" },
      ],
    },
    {
      name: "Rajan",
      title: "B.E. CIVIL",
      location: "Miami",
      experience: 8,
      appliedDaysAgo: 6,
      src: Rajan,
      rounds: [
        { progress: 70, name: "Round 1", description: "Communication" },
        { progress: 100, name: "Round 2", description: "Technical" },
      ],
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const candidatesPerPage = 6;
  const pageCount = Math.ceil(candidates.length / candidatesPerPage);

  const currentCandidates = candidates.slice(
    currentPage * candidatesPerPage,
    (currentPage + 1) * candidatesPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="bg-[#040109] h-screen flex flex-col">
      <Navbar />
      <div className="h-[80%] overflow-y-auto ml-[30px] mt-10 mr-20">
        <div className="h-full flex flex-wrap">
          {currentCandidates.map((candidate, index) => (
            <Card key={index} index={index} candidate={candidate} />
          ))}
        </div>
      </div>
      <div className="h-[15%] flex items-center">
        <div className="flex-grow flex justify-center">
          <ReactPaginate
            previousLabel={<SlArrowLeft />}
            nextLabel={<SlArrowRight />}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex items-center"}
            activeClassName={"active"}
            pageClassName="px-1"
            activeLinkClassName="bg-purple-600 border-purple-600 text-white rounded-lg"
            pageLinkClassName="p-[12px] py-[7px] border border-paginationBox bg-paginationBox text-[#5D5D5D] rounded-lg"
            previousClassName={`p-[8px] border rounded-lg ${
              currentPage === 0
                ? "bg-paginationBox border-paginationBox text-[#C9C9C9]"
                : "bg-paginationBox border-paginationBox cursor-pointer"
            }`}
            previousLinkClassName={`${
              currentPage === 0 ? "cursor-default text-[#C9C9C9]" : ""
            }`}
            nextClassName={`p-[8px] border rounded-lg ${
              currentPage === pageCount - 1
                ? "bg-paginationBox border-paginationBox text-[#C9C9C9]"
                : "bg-paginationBox border-paginationBox cursor-pointer"
            }`}
            nextLinkClassName={`${
              currentPage === pageCount - 1 ? "cursor-default text-[#C9C9C9]" : ""
            }`}
            disabledClassName="cursor-default text-[#C9C9C9]"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicantResult;