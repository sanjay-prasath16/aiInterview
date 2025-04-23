import { UserContext } from "../../context/userContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Profile from "../assets/userProfile.png";
import Edit from "../assets/edit.svg";
import { FaTrophy } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaRegFolderOpen } from "react-icons/fa6";
import { PiSuitcaseSimpleFill } from "react-icons/pi";
import { FaCamera } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import Navbar from "../Components/Navbar";

const CandidateProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const firstRoundScore = user?.firstRoundScore || "-";
  const secondRoundScore = user?.secondRoundScore || "-";
  const [profileImage, setProfileImage] = useState(user.profile || Profile);
  const [progress, setProgress] = useState(0);
  const [secondProgress, setSecondProgress] = useState(0);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [newTechnology, setNewTechnology] = useState("");
  const [projects, setProjects] = useState(user?.projects ? [...user.projects] : []);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [experiences, setExperiences] = useState(user?.experiences ? [...user.experiences] : []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedRole, setEditedRole] = useState(user?.role || "Your Role");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");

  useEffect(() => {
    setProgress(Math.min(Math.max(firstRoundScore, 0), 100));
    setSecondProgress(Math.min(Math.max(secondRoundScore, 0), 100));
  }, [firstRoundScore, secondRoundScore]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      try {
        const formData = new FormData();
        formData.append('profile', file);
        const response = await axios.put('http://localhost:8000/update-profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error updating profile image:', err);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/api/update-profile', {
        name: editedName,
        email: editedEmail,
        role: editedRole,
        profile: profileImage,
        projects: user.projects || [],
        experiences: user.experiences || []
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddProject = () => {
    setShowProjectForm(true);
  };

  const handleAddExperience = () => {
    setShowExperienceForm(true);
  };

  const handleSaveProject = async () => {
    const newProject = {
      name: projectName,
      description: projectDescription,
      technologies: technologies,
    };
  
    try {
      const existingProjects = Array.isArray(user?.projects) ? user.projects : [];
      
      const response = await axios.put('http://localhost:8000/updateProfile', {
        projects: [...existingProjects, newProject]
      });
      
      setUser(response.data);
      setProjects(response.data.projects || []);
      setShowProjectForm(false);
      setProjectName("");
      setProjectDescription("");
      setTechnologies([]);
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleCancelProject = () => {
    setShowProjectForm(false);
    setProjectName("");
    setProjectDescription("");
    setTechnologies([]);
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() !== "") {
      setTechnologies([...technologies, newTechnology]);
      setNewTechnology("");
    }
  };

  const handleSaveExperience = async () => {
    const newExperience = {
      role: role,
      companyName: companyName,
      description: experienceDescription,
      startDate: startDate,
      endDate: endDate,
    };
  
    try {
      const existingExperiences = Array.isArray(user?.experiences) ? user.experiences : [];
      
      const response = await axios.put('http://localhost:8000/update-profile', {
        experiences: [...existingExperiences, newExperience]
      });
      
      setUser(response.data);
      setExperiences(response.data.experiences || []);
      setShowExperienceForm(false);
      setRole("");
      setCompanyName("");
      setExperienceDescription("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error('Error saving experience:', err);
    }
  };

  const handleCancelExperience = () => {
    setShowExperienceForm(false);
    setRole("");
    setCompanyName("");
    setExperienceDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-[#040109] px-[3%] pb-[2%] text-white">
      <Navbar />
      <div className="flex mt-[2%]">
        <div className="relative w-[7%]">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full border-4 border-purple-500 rounded-full"
          />
          <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-3 rounded-full cursor-pointer">
            <FaCamera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="w-full ml-[2%]">
          <div className="w-[45%] flex justify-between mt-[1.2%]">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-[24px] font-bold bg-transparent border-b border-white"
              />
            ) : (
              <p className="text-[24px] font-bold">{user?.name}</p>
            )}
            {isEditing ? (
              <div>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-green-500 px-3 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <img 
                src={Edit} 
                alt="" 
                className="w-7 cursor-pointer" 
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
          <div className="w-[45%] flex justify-between mt-[0.5%]">
            {isEditing ? (
              <input
                type="text"
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
                className="text-[14px] bg-transparent border-b border-white"
              />
            ) : (
              <p className="text-[14px] text-gray-500 font-semibold">{user?.role || "Your Role"}</p>
            )}
            {isEditing ? (
              <input
                type="text"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="text-[14px] bg-transparent border-b border-white"
              />
            ) : (
              <p className="text-[14px] text-gray-500 font-semibold">
                {user?.email}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex mt-[3%]">
        <div className="w-[50%] bg-[linear-gradient(to_right,#280F4F,#1E0B3D)] rounded-xl p-8">
          <div className="flex w-full justify-between">
            <p className="text-[16px] font-bold">First Round Score</p>
            <FaTrophy className="text-2xl mt-1 text-[#A787D8]" />
          </div>
          <p className="text-[34px] font-bold pt-[0.5%] text-[#A787D8]">
            {firstRoundScore}/100
          </p>
          <div className="relative w-full h-5 bg-purple-950 rounded-xl mt-2 overflow-hidden">
            <div
              className="absolute h-full bg-purple-600 rounded-xl transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="w-[50%] bg-[linear-gradient(to_right,#111D49,#0C143B)] rounded-xl p-8 ml-[5%]">
          <div className="flex w-full justify-between">
            <p className="text-[16px] font-bold">Second Round Score</p>
            <FaMedal className="text-2xl mt-1 text-[#60A5FA]" />
          </div>
          <p className="text-[34px] font-bold pt-[0.5%] text-[#60A5FA]">
            {secondRoundScore}/100
          </p>
          <div className="relative w-full h-5 bg-blue-950 rounded-xl mt-2 overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 rounded-xl transition-all duration-500"
              style={{ width: `${secondProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex mt-[2%] justify-between">
        <p className="text-[24px] font-bold">Projects</p>
        <p
          className="bg-[#8B5CF6] flex items-center justify-center px-6 py-2 rounded-lg whitespace-nowrap cursor-pointer"
          onClick={handleAddProject}
        >
          <IoMdAdd className="text-[15px] mr-2" />
          <span className="text-[16px]">Add Project</span>
        </p>
      </div>
      <div
        className={`w-full bg-[#0B0C18] mt-[2%] rounded-xl flex flex-col items-center transition-all duration-500 ${showProjectForm ? "px-20 py-10" : "px-10 py-5"
          }`}
      >
        {showProjectForm ? (
          <div className="w-full">
            <p className="text-[24px] font-bold mb-6">Add New Project</p>
            <div className="mt-10">
              <p className="text-gray-400 mb-1">Project Name</p>
              <input
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
              />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 mb-1">Description</p>
              <textarea
                name="description"
                className="w-full p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
                placeholder="Enter Project Description"
                rows={5}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-6">
              <p className="text-gray-400 mb-1">Tech Stack</p>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Add Technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  className="w-[20%] p-3 px-5 bg-[#171931] rounded-lg text-white outline-none border border-white/5"
                />
                <button onClick={handleAddTechnology} className="-ml-8">
                  <IoMdAdd className="text-white" />
                </button>
              </div>
              <div className="flex flex-wrap mt-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-[#8B5CF6] text-white px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCancelProject}
                className="px-6 py-2 rounded-lg mr-4 text-[#5959db] border border-[#5959db]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="bg-[#8B5CF6] px-6 py-2 rounded-lg"
              >
                Save Project
              </button>
            </div>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="w-full mb-6">
              <p className="text-[24px] font-bold">{project.name}</p>
              <p className="text-[14px] text-gray-400 mt-3">
                {project.description}
              </p>
              <div className="flex flex-wrap mt-5">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-[#8B5CF6] text-white px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="rounded-full bg-[#171931] w-40 h-40 flex justify-center items-center">
              <FaRegFolderOpen className="text-[4rem] text-[#8B5CF6]" />
            </div>
            <p className="text-[30px] mt-[0.5%] font-semibold">
              No Projects Added
            </p>
            <p className="text-[14px] text-gray-400">
              Start adding your projects to showcase your work
            </p>
          </div>
        )}
      </div>
      <div className="flex mt-[2%] justify-between">
        <p className="text-[24px] font-bold">Experience</p>
        <p
          className="bg-[#8B5CF6] flex items-center justify-center px-6 py-2 rounded-lg whitespace-nowrap cursor-pointer"
          onClick={handleAddExperience}
        >
          <IoMdAdd className="text-[15px] mr-2" />
          <span className="text-[16px]">Add Experience</span>
        </p>
      </div>
      <div
        className={`w-full bg-[#0B0C18] mt-[2%] rounded-xl flex flex-col items-center transition-all duration-500 ${showExperienceForm ? "px-20 py-10" : "px-10 py-5"
          }`}
      >
        {showExperienceForm ? (
          <div className="w-full">
            <p className="text-[24px] font-bold mb-6">Add New Experience</p>
            <div className="mt-10">
              <p className="text-gray-400 mb-1">Role</p>
              <input
                type="text"
                placeholder="Enter Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
              />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 mb-1">Company Name</p>
              <input
                type="text"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
              />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 mb-1">Description</p>
              <textarea
                name="description"
                className="w-full p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
                placeholder="Enter Experience Description"
                rows={5}
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex w-full justify-center">
              <div className="mt-6">
                <p className="text-gray-400 mb-1">Start Date</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[20rem] p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
                />
              </div>
              <div className="mt-6 ml-[10%]">
                <p className="text-gray-400 mb-1">End Date</p>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[20rem] p-5 outline-none bg-[#171931] rounded-lg text-white border border-white/5"
                />
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button
                onClick={handleCancelExperience}
                className="px-6 py-2 rounded-lg mr-4 text-[#5959db] border border-[#5959db]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExperience}
                className="bg-[#8B5CF6] px-6 py-2 rounded-lg"
              >
                Save Experience
              </button>
            </div>
          </div>
        ) : experiences.length > 0 ? (
          experiences.map((experience, index) => (
            <div key={index} className="w-full mb-6 flex">
              <div className="bg-[#171931] h-20 w-16 rounded-[12px] mr-7 flex justify-center items-center">
                <FaBuilding className="text-2xl" />
              </div>
              <div>
                <p className="text-[24px] font-bold">{experience.role}</p>
                <p className="text-[14px] text-gray-400 mt-3">
                  {experience.companyName}
                </p>
                <p className="text-[14px] text-gray-400 mt-3">
                  {experience.description}
                </p>
                <p className="text-[14px] text-gray-400 mt-3 flex">
                  <FaCalendar className="text-xl mr-3" />
                  {experience.startDate} - {experience.endDate}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="rounded-full bg-[#171931] w-40 h-40 flex justify-center items-center">
              <PiSuitcaseSimpleFill className="text-[4rem] text-[#8B5CF6]" />
            </div>
            <p className="text-[30px] mt-[0.5%] font-semibold">
              No Experience Added
            </p>
            <p className="text-[14px] text-gray-400">
              Start adding your professional experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;