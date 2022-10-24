import { Link,useNavigate } from "react-router-dom";
import {useState} from 'react';
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import "./styles.css";
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
        <div className="login-page login-signup">
        <div className="form">
          <div className="login">
            <div className="login-header">
              <h3>LOGIN</h3>
              <p>Please enter your credentials to login.</p>
            </div>
          </div>
          <form className="login-form" onSubmit={loginUser}>
            <input type="email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            <input type="submit" value="Login" className="btn"/>
          </form>
          <p className="message">Not registered?  <Link className="message" to="/signup">Click Here</Link> </p>
          <div id="signInDiv" className="signInDiv">

          </div>
            
        </div>
      </div>
	);
}

export default Login;
