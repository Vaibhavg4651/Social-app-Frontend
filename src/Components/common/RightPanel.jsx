import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { setusers, setdata } from "../../Reducers/userSlice";
import URL from "../../ConfigUrl/config";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const dispatch = useDispatch();
	const [id , setId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const authUser = useSelector((state) => state.user.userdata);
	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			try {
			  const response = await axios.get(`${URL}/suggestedusers/${authUser._id}`);
			  if (isMounted) { // add conditional check
				dispatch(setusers(response.data.message));
				dispatch(setdata(response.data.user));
			  }
			} catch (error) {
			  err(`${error}`);
			} 
		  };
		  fetchData();
		  return () => { isMounted = false };
		}
		, [authUser._id, dispatch]);
		
		const users = useSelector((state) => state.user.users);

		const err = (msg) => {
			toast.error(msg, {
			  position: "bottom-right",
			  theme: "colored",
			});
		  };

	const handlefollow = async(id) => {
		
		try {
			setIsLoading(true);
			const res = await axios.get(`${URL}/follow/${id}/${authUser._id}`);
			if (res.data.success === true) {
			  toast.success("Successfully updated", {
				position: "bottom-right",
				theme: "colored",
			  });
			  console.log(res.data)
			  window.location.reload();
			} else {
			  err(`${res.data.message}`);
			}
		  } catch (e) {
			err(`${e}`);
		  } finally {
			setIsLoading(false);
		  }
	}

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
				{isLoading &&  <LoadingSpinner />}
					{!isLoading && users.map((user) => (
							<Link
								to={`/profile/${user._id}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
	
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.user_photo_url || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.name}
										</span>
										<span className='text-sm text-slate-500'>@{user.user_name}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											handlefollow(user._id);
										}}
									>
										{isLoading ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;