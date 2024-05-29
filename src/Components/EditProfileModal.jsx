import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import URL from "../ConfigUrl/config";
import { setdata } from "../Reducers/userSlice";

const EditProfileModal = () => {
	const user=useSelector((state)=>{return state.user})
  	let authUser = user.userdata;
  	const dispatch = useDispatch();
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
	});
	const isValidEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	  };

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.name,
				username: authUser.user_name,
				email: authUser.user_email,
				bio: authUser.user_bio,
			});
		}
	}, [authUser]);


	const err = (msg) => {
		toast.error(msg, {
		  position: "bottom-right",
		  theme: "colored",
		});
	  };

	const handleSubmit = async (e) => {
		e.preventDefault();
    if (!isValidEmail(formData.email)) {
      err("Invalid email");
      return false;
    }
      try {
        const res = await axios.patch(`${URL}/user/${authUser._id}`, {
			user_id: authUser._id,
			name: formData.fullName,
          	user_email: formData.email,
          	user_name: formData.username,
			user_bio: formData.bio,
        });
        if (res.data.success === true) {
          toast.success("Successfully updated", {
            position: "bottom-right",
            theme: "colored",
          });
          dispatch(setdata(res.data.message));
		  window.location.reload();

        } else {
          err(res.data.message);
        }
      } catch (e) {
        err("something went wrong...");
      }
    };



	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={handleSubmit}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<button className='btn btn-primary rounded-full btn-sm text-white'>Update</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;