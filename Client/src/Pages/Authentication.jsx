import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Background from '../assets/AuthenticationVideo.mp4';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };
        try {
            await axios.post('http://localhost:8000/register', data);
            toast.success("Registration successful! Please login.");
            setIsLogin(true);
        } catch (error) {
            toast.error(error.response?.data?.err || "Registration failed.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        try {
            const response = await axios.post('http://localhost:8000/login', data, { withCredentials: true });
            if (response.data.err) {
                toast.error(response.data.err);
            } else {
                toast.success("Welcome Back! Let's pick up where you left off.");
                setUser(response.data);
                navigate('/home');
            }
        } catch (error) {
            toast.error(error.response?.data?.err || "An error occurred during login.");
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='h-screen w-screen flex bg-[#040109] overflow-hidden'>
            <div className='w-[60%] h-full'>
                <video className="h-full w-full object-cover rounded-r-[25px]" autoPlay muted loop>
                    <source src={Background} />
                </video>
            </div>

            <div className='w-[40%] h-full flex items-center justify-center'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className='w-full p-44 rounded-lg shadow-2xl'
                    >
                        {isLogin ? (
                            <form onSubmit={handleLogin} className='space-y-6'>
                                <h2 className='font-bold text-white text-center text-[3rem]'>Login</h2>
                                <p className='text-white w-full text-center'>Login now to upskill your knowledge and skills</p>
                                <div>
                                    <label htmlFor="username" className='block text-sm text-gray-300 text-[1.2rem] pt-[5%]'>Username</label>
                                    <input type="text" id="username" name="username" required
                                        className='w-full px-4 py-3.5 bg-white/15 border border-white/20 outline-none rounded-lg text-white' />
                                </div>
                                <div className='pb-[7%]'>
                                    <label htmlFor="password" className='block text-sm text-gray-300 text-[1.2rem]'>Password</label>
                                    <div className='relative'>
                                        <input type={showPassword ? "text" : "password"} id="password" name="password" required
                                            className='w-full px-4 py-3.5 bg-white/15 border border-white/20 outline-none rounded-lg text-white' />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className='absolute right-6 top-[1.1rem] text-gray-400'>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className='w-full py-4 bg-blue-600 rounded-lg text-white hover:bg-blue-700'>Login</button>
                                <p className='text-center text-gray-400 pt-[2%]'>Don't have an account? <span onClick={toggleForm} className='text-blue-500 cursor-pointer'>Sign up</span></p>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className='space-y-6'>
                                <h2 className='text-[3rem] font-bold text-white text-center'>Sign Up</h2>
                                <p className='text-white w-full text-center'>Register yourself to get all our access free</p>
                                <div>
                                    <label htmlFor="username" className='block text-sm text-gray-300'>Username</label>
                                    <input type="text" id="username" name="username" required
                                        className='w-full px-4 py-3.5 bg-white/15 border border-white/20 outline-none rounded-lg text-white' />
                                </div>
                                <div>
                                    <label htmlFor="email" className='block text-sm text-gray-300'>Email</label>
                                    <input type="email" id="email" name="email" required
                                        className='w-full px-4 py-3.5 bg-white/15 border border-white/20 outline-none rounded-lg text-white' />
                                </div>
                                <div>
                                    <label htmlFor="password" className='block text-sm text-gray-300'>Password</label>
                                    <div className='relative'>
                                        <input type={showPassword ? "text" : "password"} id="password" name="password" required
                                            className='w-full px-4 py-3.5 bg-white/15 border border-white/20 outline-none rounded-lg text-white' />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className='absolute right-6 top-[1.1rem] text-gray-400'>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className='w-full py-4 bg-blue-600 rounded-lg text-white hover:bg-blue-700'>Sign Up</button>
                                <p className='text-center text-gray-400 pt-[2%]'>Already have an account? <span onClick={toggleForm} className='text-blue-500 cursor-pointer'>Login</span></p>
                            </form>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;