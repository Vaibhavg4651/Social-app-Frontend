import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import XSvg from "./svgs/X";
import URL from "../ConfigUrl/config";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import {setdata,setisLoggedin} from '../Reducers/userSlice'

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const dispatch=useDispatch()
    const navigate=useNavigate()

	const handleSubmit = async(e) => {
		e.preventDefault();
      try {
        const res = await axios.post(`${URL}/login`, {
          	email: formData.email,
          	password: formData.password,
        });
        if(res.data.success===true){
			dispatch(setisLoggedin(true))
		   dispatch(setdata(res.data.message))

		   toast.success("login successfull", {
			  'position': 'bottom-right',
			  'theme': 'colored'
		  })
		  navigate(`/`)
		  }else{
			  err(res.data.message)
		  }
		}catch(e){
			  console.log(e);
      }
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;