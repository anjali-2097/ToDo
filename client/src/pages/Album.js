import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react'
import Header from "./Header";
import axios from 'axios';
import './gallery.css';

const Album = () => {
  const inputFile = useRef(null)
  const [isSelected, setIsSeleted] = useState(false);
  const [fileChange, setFileChange] = useState();
  const [file, setFile] = useState()
  const [user, setUser] = useState({});
  const [errormsg, setErrormsg] = useState('');
  const [albums, setalbum] = useState([]);
  const [imageName, setImageName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isValue, setIsValue] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    loginUser();

  }, []);
  useEffect(() => {
    if (user && user._id) {
      fetchAlbum();
    }
  }, [user])
  async function fetchAlbum() {
    const token = localStorage.getItem('token');
    const body = {
      authorization: `Bearer ${token}`,
      id: user._id
    }
    try {
      await axios.get(`http://localhost:8080/album/?id=${user._id}`).then((response) => {
        setalbum(response.data);
      });
    } catch (e) {
      console.log(e);
      navigate('/login');
    }
  }
  async function loginUser() {
    const token = localStorage.getItem('token');
    try {
      const userdata = await axios.post('http://localhost:8080/user', {
        authorization: `Bearer ${token}`,
      })
      if (userdata.data.user) {
        setUser(userdata.data.user);
      }
      else {
        navigate('/login');
        setErrormsg(userdata.data.errormsg);
        console.log(errormsg);
      }
    }
    catch (e) {
      console.log(e);
      navigate('/login');
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!imageName || !file) {
      alert("Image Name or File empty..")
      return;
    }
    const url = `http://localhost:8080/album`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const body = {
      file: file,
      id: user._id,
      label: imageName
    }
    axios.post(url, body, config).then((response) => {
      
    });
    alert('Image saved successfully');
    fetchAlbum();
    document.getElementById("file").value = "";
    setImageName('');
  }

  const deleteImage = (value) => {

    axios.delete(`http://localhost:8080/album?id=${value._id}`).then((response) => {
    });
    alert('Image deleted successfully');
    setalbum("");
    fetchAlbum();
  }

  const handleFileChange = () => {
    setFileChange(inputFile.current.files[0]);
    setIsSeleted(true);
  }

  const editImage = () => {
    inputFile.current.click();
  }


  const editApiCall = async (value, fileChange) => {
    try {
      const body = {
        file: fileChange,
        id: value._id,
      }
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      let result = await axios.put(`http://localhost:8080/album`, body, config);
      fetchAlbum();
      setIsSeleted(false);
      setIsValue(null);
      alert('Image updated successfully');
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isSelected && isValue) {
      editApiCall(isValue, fileChange);
    }
  }, [isSelected, isValue]);

  return (
    <>
    <Header></Header>
     <div className="container px-5 py-12 mx-auto">
      
      <div className="px-2 py-2">
      <div className="relative border-2 flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
          <input
          className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          type="text"
          id="search"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search something.." /> 
      </div>
  </div>
  
  <form onSubmit={handleSubmit}>
  <div className="flex flex-wrap -mx-3 mb-2">
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800"
                >
                    Image Name
                </label>
                <input
                    type="text"
                    name='imageName'
                    value={imageName} onChange={(e) => setImageName(e.target.value)}
                    placeholder="Enter Image Name"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
      </div>
      <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
      <label htmlFor="formFile" className="block text-sm font-semibold text-gray-800">Upload Image</label>
    <input className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40" 
    onChange={(e) =>setFile(e.target.files[0])}
    id="file"
    type="file" 
    name="file"></input>
    </div>
    <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
    <input type="submit" name='submit' className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600" value="Submit"/>
    </div>
  </div>
</form>
<div className="flex flex-wrap -m-4" >
        {
          albums.length && albums.filter((value)=>{
            if(searchValue===""){
              return value
            }else if(value.label.toLowerCase().includes(searchValue.toLowerCase())){
              return value
            }}).map((value) => {
            return (
      
             <div className=" group relative lg:w-1/4 md:w-1/2 p-4 w-full" key={value._id}>
               <div className="block relative h-48 rounded overflow-hidden">
                 <img alt="ecommerce" className="object-cover object-center w-full h-full block" src={`http://localhost:8080/static/${value.name}`}></img>
               </div>
               <div className="hidden group-hover:block  bg-white  w-auto">
     <div className="justify_btns absolute flex-1">
       <button className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2"   onClick={() => { setIsValue(value); editImage(value); }}>Edit</button>
       <input
                      id='replace'
                      name='replace'
                      style={{ display: 'none' }}
                      ref={inputFile}
                      type="file"
                      onChange={() => handleFileChange()}
                    />
    <button className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-800 m-2" onClick={() => { deleteImage(value) }}>Delete</button>
     </div>
   </div> 
               <div className="mt-4">
                 <h2 className="text-gray-900 title-font text-lg font-medium text-center">{value.label}</h2>
               </div>
             </div>
  
  
             
            
            )
          })
        }
</div>
        </div>
     
    </>
  )
}

export default Album