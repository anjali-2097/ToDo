import React from 'react'
import {  useState } from 'react'
import { useNavigate } from "react-router-dom";

function Header() {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const navigate = useNavigate();

    function logoutuser() {
        localStorage.setItem('token',"");
        navigate('/login');
        }
  return (
    <div>
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-slate-500 mb-3">
    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
        <a
          className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
          href="/"
        >
          Authenticator App
        </a>
        <button
          className="cursor-pointer text-xl leading-none px-3 py-1 lg:hidden flex flex-col h-10 w-12 border-2 border-black rounded justify-center items-center group"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <svg viewBox="0 0 100 80" width="30" height="40">
<rect width="100" height="10"></rect>
<rect y="30" width="100" height="10"></rect>
<rect y="60" width="100" height="10"></rect>
</svg>
        </button>
      </div>
      <div
        className={
          "lg:flex flex-grow items-center" +
          (navbarOpen ? " flex" : " hidden")
        }
        id="example-navbar-danger"
      >
        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="/home"
            >
              <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Home</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="/todo"
            >
              <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2">To Do App</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="/album"
            >
              <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Image Gallery</span>
            </a>
          </li>
          <li className="nav-item cursor-pointer">
            <a onClick={logoutuser}
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
            >
              <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
  )
}

export default Header