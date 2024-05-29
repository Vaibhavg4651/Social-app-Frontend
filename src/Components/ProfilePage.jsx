import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import URL from "../ConfigUrl/config";
import Posts from "./common/Posts";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { POSTS } from "../utils/db/dummy";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setdata } from "../Reducers/userSlice";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");
	const [isLoading, setIsLoading] = useState(false);
	const user = useSelector((state) => state.user.userdata);
	const dispatch = useDispatch();

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const isMyProfile = true;

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const err = (msg) => {
		toast.error(msg, {
		  position: "bottom-right",
		  theme: "colored",
		});
	  };

	const handleUpdateProfile = async(e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const res = await axios.patch(`${URL}/userimg/${user._id}`, {
				user_id: user._id, 
				user_photo_url: profileImg,
				coverImg: coverImg,
			});
			console.log(res.data)
			if (res.data.success === true) {
			  toast.success("Successfully updated", {
				position: "bottom-right",
				theme: "colored",
			  });
			  dispatch(setdata(res.data.message))
			  setProfileImg(null);
				setCoverImg(null);
			  window.location.reload();
			} else {
			  err(res.data);
			}
		  } catch (e) {
			err("something went wrong...");
		  } finally {
			setIsLoading(false);
		  }
		
	}

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading && <p>Loading...</p>}
				{ !isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{ !isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.name}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.user_photo_url || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => alert("Followed successfully")}
									>
										Follow
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={handleUpdateProfile}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-8 px-4'>
								<div className='flex flex-col'>
									<div className="flex align-baseline">
										<span className='font-bold text-lg p-1'>{user?.name}</span>
										<span className='text-sm text-slate-500 p-2'>@{user?.user_name}</span>
									</div>
									<div className="flex">
										<span className='text-sm my-1'>{user?.user_bio}</span>
									</div>
								</div>

								<div className='flex gap-2 flex-wrap'>
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>Joined July 2021</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.user_following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.user_followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;