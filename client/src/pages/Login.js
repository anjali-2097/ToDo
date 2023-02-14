import { Link,useNavigate } from "react-router-dom";
import {useState} from 'react';
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import axios from 'axios';

 function Login() {
  const navigate = useNavigate();
  const nev=()=>{
    navigate("/home");
  }
  async function  handleCredentialResponse(response) {
    var userObject = jwt_decode(response.credential);
    const user_profile = {name:userObject.name,email:userObject.email,profile:userObject.picture};
   const googleresp=await axios.post("http://localhost:8080/googleuser",{
    user_profile
   });
   if(googleresp.data.user){
    alert('Login successful')
    localStorage.setItem("token",googleresp.data.token);
  nev();
   }
   else{
    alert('Login unsuccessful! Please check username and password')
   }
  }
  useEffect(() => {
     /* global google */
    google.accounts.id.initialize({
      client_id: '376297455298-teiv577vhau3dn0rlm6o53qrt2fb0pr2.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  },[]);
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  async function loginUser(e) {
  
    e.preventDefault()
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
    const data = await response.json()
    if (data.user) {
      alert('Login successful')
      localStorage.setItem("token",data.token);
      nev();
    } else {
      alert('Login unsuccessful! Please check username and password')
    }
  }	
	return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-rose-600/40 ring ring-2 ring-purple-600 lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Sign in
                </h1>
                <form className="mt-6" onSubmit={loginUser}>
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    
                    <div className="mt-6">
                        <input type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600" value="Login"/>
                            
                    </div>
                </form>
                <div className="relative flex items-center justify-center w-full mt-6 border border-t">
                    <div className="absolute px-5 bg-white">Or</div>
                </div>
                
                <div className="flex mt-6 gap-x-2 justify-center">
                <div id="signInDiv" className="signInDiv">

</div>
                </div>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="font-medium text-purple-600 hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
	);
}

export default Login;
