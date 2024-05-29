import Post from "./Post";
// import { POSTS } from "../../utils/db/dummy";
import URL  from "../../ConfigUrl/config";
import { useEffect, useState } from "react";
import { setPosts } from "../../Reducers/userSlice";
import axios from "axios";
import { useDispatch , useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const PAGE_SIZE = 4;

const Posts = () => {
	const allPosts = useSelector((state) => state.user.posts);
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [posts, setPostsState] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
			  const response = await axios.get(`${URL}/posts`);
			  dispatch(setPosts(response.data));
			  setPostsState(response.data.slice(0, PAGE_SIZE));
			} catch (error) {
			  setError(error);
			} 
		  };
		  fetchData();
	}
	, [dispatch]);

	useEffect(() => {
		const handleScroll = () => {
		  if (
			window.innerHeight + document.documentElement.scrollTop + 1 >=
			document.documentElement.scrollHeight
		  ) {
			loadMorePosts();
		  }
		};
	
		window.addEventListener("scroll", handleScroll);
	
		return () => window.removeEventListener("scroll", handleScroll);
	  }, [posts, allPosts]);
	
	  const loadMorePosts = () => {
		if (loading || error) return;
	
		setLoading(true);
	
		// Simulate API call delay
		setTimeout(() => {
		  const newPage = page + 1;
		  const newPosts = allPosts.slice(0, newPage * PAGE_SIZE);
		  setPostsState(newPosts);
		  setPage(newPage);
		  setLoading(false);
		}, 1500);
	  };

	return (
		<>
			{ posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
			{loading && <LoadingSpinner />}
			{error && <div>Error loading posts</div>}
		</>
	);
};
export default Posts;