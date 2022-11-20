import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import './Album.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



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

  function handleChange(event) {
    setFile(event.target.files[0])
  }
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
    setFile('');
    setImageName('');
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  }


  const handleName = (e) => {
    setImageName(e.target.value);
  }

  const deleteImage = (value) => {

    axios.delete(`http://localhost:8080/album?id=${value._id}`).then((response) => {
    });
    alert('Image deleted successfully');
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
      <div>
        <h1>Album</h1>
        <Box className='searchContainer' sx={{ '& > :not(style)': { m: 1, width: '50%' }, }}>
          <input type='text' onChange={(e) => setSearchValue(e.target.value)} placeholder='Search image by label' />
        </Box>
        <form onSubmit={handleSubmit}>
          <div className='image_form'>
            <input type="file" onChange={handleChange} name='file' />
            <input type="text" onChange={handleName} placeholder='Enter Image Name' />
            <input type="submit" name='submit' className='submit_btn'/>
          </div>
        </form>
      </div>
      <div className='containercard'>
        {
          albums.length && albums.filter((value)=>{
            if(searchValue===""){
              return value
            }else if(value.label.toLowerCase().includes(searchValue.toLowerCase())){
              return value
            }}).map((value) => {
            return (
              <div className="card" key={value._id}>
                <img className='image' width="100%" height="100%" src={`http://localhost:8080/static/${value.name}`} alt="..." />
                <span>{value.label}</span>
                <div className="middle">
                  <div className="text"><button className='imagebtn' onClick={() => { deleteImage(value) }}>Delete</button>
                    <button className='imagebtn' onClick={() => { setIsValue(value); editImage(value); }}>Edit</button>
                    <input
                      id='replace'
                      name='replace'
                      style={{ display: 'none' }}
                      ref={inputFile}
                      type="file"
                      onChange={() => handleFileChange()}
                    /></div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Album