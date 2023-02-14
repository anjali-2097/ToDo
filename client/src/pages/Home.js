import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react'
import axios from 'axios';
import Header from './Header';

function Home() {
  
  const [user,setUser] = useState({});
  const [edituser,setEditUser] = useState({});
  const [edit,setEdit] = useState(false);
  const [errormsg,setErrormsg] = useState('');
  const navigate = useNavigate();

useEffect(()=>{
    loginUser();
},[]);
  async function loginUser() {
    const token=localStorage.getItem('token');
    try{
    const userdata= await axios.post('http://localhost:8080/user',{
      
            authorization:`Bearer ${token}`,
        
    })
   if(userdata.data.user){
        setUser(userdata.data.user);
        setEditUser(user);
   }
    else{
      
    navigate('/login');
    setErrormsg(userdata.data.errormsg);
    console.log(errormsg);
  }
}
  catch(e){
    console.log(e);
    navigate('/login');
  }
  }

  async function submit() {
    
    const token=localStorage.getItem('token');
    try{
    const userdata= await axios.put('http://localhost:8080/user',{
            authorization:`Bearer ${token}`,
            user:edituser
        
    })
   if(userdata.data.user){
    console.log(userdata.data.user)
        setUser(userdata.data.user);
        setEditUser(user);
   }
    else{
      
    navigate('/login');
    setErrormsg(userdata.data.errormsg);
    console.log(errormsg);
  }
}
  catch(e){
    console.log(e);
    navigate('/login');
  }
  }
	return (
    <div>
    <Header/>
    <section className="text-gray-600 body-font">
<div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
<img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={user.profilePicture}></img>
{ edit && (
  <div className="w-full p-6 m-auto">
  <label
      htmlFor="profile-pic"
      className="block text-sm font-semibold text-gray-800"
  >
      Profile Picture URL
  </label>
  <input
      type="url"
      value={edituser.profilePicture} onChange={(e) => setEditUser({...edituser,profilePicture:e.target.value})}
      className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
  />
</div>
               
               )

               }
<div className="text-center lg:w-2/3 w-full">
  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Name: {user.name}</h1>
  { edit ? (
                <div className="w-full p-6 m-auto">
                <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-800"
                >
                    User Name
                </label>
                <input
                    type="text"
                    value={edituser.name} onChange={(e) => setEditUser({...edituser,name:e.target.value})}
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
               ):""

               }
  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Email: {user.email}</h1>
  { edit && (
                <div className="w-full p-6 m-auto">
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800"
                >
                    Email
                </label>
                <input
                    type="text"
                    value={edituser.email} onChange={(e) => setEditUser({...edituser,email:e.target.value})}
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
               )

               }
  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Last Active: {user.lastActive}</h1>
</div>
<div className="flex space-x-2 justify-center">
  <div className="flex p-6 space-x-2 justify-center">
    <button data-mdb-ripple="true"
    data-mdb-ripple-color="light" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={()=>{setEdit(!edit)}}>{ edit ? "Back" : "Edit"}</button>
               </div>
               { edit &&
               <div className="flex p-6 space-x-2 justify-center">
               <button data-mdb-ripple="true"
    data-mdb-ripple-color="light"
    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={submit}>Submit</button>
               </div>
               }
               </div>
</div>
</section>
</div>
        
	);
  
}

export default Home;


