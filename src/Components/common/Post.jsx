import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import URL from "../../ConfigUrl/config";
import toast from "react-hot-toast";
import axios from "axios";

const Post = ({ post }) => {
	const[isLiking,setIsLiking] = useState(false);
	const authUser = useSelector((state) => state.user.userdata);
	const postOwner = post;
	const isLiked = post.likes.includes(authUser._id);;

	const formattedDate = "1h";
	const err = (msg) => {
		toast.error(msg, {
		  position: "bottom-right",
		  theme: "colored",
		});
	  };

	const handleLikePost = async(e) => {
		e.preventDefault();
		
		try {
			setIsLiking(true);
			const res = await axios.get(`${URL}/like/${post._id}/${authUser._id}`);
			console.log(res.data)
			if (res.data.success === true) {
			  toast.success("Successfully updated", {
				position: "bottom-right",
				theme: "colored",
			  });
			  window.location.reload();
			} else {
			  err(res.data);
			}
		  } catch (e) {
			err(`${e}`);
		  } finally {
			setIsLiking(false);
		  }

	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.user_name}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.user_photo_url || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.user_name}`} className='font-bold'>
							{postOwner.name}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.user_name}`}>@{postOwner.user_name}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.description}</span>
						{post.post_photo_url && (
							<img
								src={post.post_photo_url}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									0
								</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking  && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking  && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;