import { useContext, useState } from 'react';
import { UserContext } from "../../context/userContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Assessify from '../assets/assessify.png';
import logoutSvg from '../assets/logoutIcon.gif';
import PropTypes from "prop-types";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const logout = async () => {
    const { data: responseData } = await axios.get('http://localhost:8000/logout', { withCredentials: true });
    toast.success(responseData.message);
    setUser(null);
    navigate('/');
  };

  return (
    <div className="text-white p-5 flex justify-between w-full items-center shadow-lg">
      <img src={Assessify} alt="Assessify Logo" className="w-[13%] min-w-[100px]" />
      <div className="flex gap-10">
        <NavLink text="Home" to="/home" />
        <NavLink text="Profile" to="/profile" />
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={logout}
      >
        <button className="text-[16px] border border-purple-800 py-2 px-5 rounded-xl flex items-center bg-purple-800 hover:bg-purple-900 transition-colors duration-300">
          <img
            src={isHovered ? logoutSvg : `${logoutSvg}?static`}
            alt="Logout"
            className="w-8 mr-2 transition-transform duration-300 hover:scale-110"
          />
          Logout
        </button>
      </div>
    </div>
  );
};

const NavLink = ({ text, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className={`text-[18px] font-semibold transition-all duration-300 ${
        isActive ? "text-purple-400" : "text-white hover:text-purple-400"
      }`}>
        {text}
      </p>
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-purple-400 transition-all duration-300 ${
          isActive || isHovered ? 'w-full' : 'w-0'
        }`}
      ></div>
    </Link>
  );
};

NavLink.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default Navbar;