import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isloggedin:false,
        userdata:null,
        posts:[],
        users:[],
    },
    reducers: {
     
      setdata(state,action){
        state.userdata=action.payload
      },
      setPosts(state,action){
        state.posts=action.payload
      },
      setusers(state,action){
        state.users=action.payload
      },
      setisLoggedin(state,action){
        state.isloggedin=action.payload
      },
    },
  })


  export default userSlice.reducer
  export const {setdata,setisLoggedin, setPosts, setusers}=userSlice.actions