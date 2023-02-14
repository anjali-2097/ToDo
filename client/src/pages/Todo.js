import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react'
import Header from "./Header";
import axios from 'axios';

function Todo() {
const [user,setUser] = useState({});
const [errormsg,setErrormsg] = useState('');
const [todos,setToDos] = useState([{checked:false, text: "Hello"}]);
const [todotext,setToDoText] = useState('');
const [searchtext,setSearchText] = useState('');
const [filter,setFilter] = useState('All');

const navigate = useNavigate();
useEffect(()=>{
    loginUser();
    fetchToDo();
},[]);
async function fetchToDo() {
  const token=localStorage.getItem('token');
  try{
    const todolist= await axios.post('http://localhost:8080/gettodos',{
            authorization:`Bearer ${token}`,
    })
   if(todolist){
        setToDos(todolist.data.todos)
   }
    else{
    navigate('/login');
    setErrormsg(todolist.data.errormsg);
    console.log(errormsg);
  }
}catch(e){
  console.log(e);
  navigate('/login');
}
}
async function loginUser() {
  const token=localStorage.getItem('token');
    try{
    const userdata= await axios.post('http://localhost:8080/user',{
      
            authorization:`Bearer ${token}`,
        
    })
   if(userdata.data.user){
        setUser(userdata.data.user);
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
  const addToDo = (e) => {
    e.preventDefault();
    if (!todotext) {
        alert("Enter the text")
        return;
    }
    const newToDoList = [...todos,{checked: false, text:todotext}]
    saveToDo(newToDoList);
    fetchToDo();
    setToDoText("");
  }
  const toggleToDo = (id) => {
      const newToDo = [...todos];
      const ToDoItem = newToDo.find((todo) => todo._id === id);
      ToDoItem.checked = !ToDoItem.checked;
      setToDos(newToDo);
      saveToDo(newToDo);
  }
  const saveToDo = (newToDoList) => {
    const token=localStorage.getItem('token');
    fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        newToDoList,authorization: `Bearer ${token}`}
      )
    }).then(() => {});
  }
  const getToDos = () => {
    if(filter==="All"){
      return todos
    }else{
      return todos.filter((todo) => filter === 'Completed' ? todo.checked : !todo.checked);
    }
  }
  function changeFilter(newFilter) {
    setFilter(newFilter);
  }
  const del_task = (e) => {
    const response = window.confirm("Are you sure you want to delete the task?");
    if (response) {
        const updatedToDoList = todos.filter((todo) => todo._id !== (e.target.value))
        setToDos(updatedToDoList);
        saveToDo(updatedToDoList);
    }
  }
  const del_all_task = (e) => {
    const response = window.confirm("Are you sure you want to delete all the tasks?");
    if (response) {
      const updatedToDoList = todos.filter((todo) => todo.checked !== true)
      setToDos(updatedToDoList);
      saveToDo(updatedToDoList);
    }
  }
  function todoClassName(todoStatus){
    if(todoStatus===true){
      return 'block px-6 py-2 border-b border-gray-200 w-full rounded-t-lg bg-green-300 text-black cursor-pointer';
    }else{
      return 'block px-6 py-2 border-b border-gray-200 w-full rounded-t-lg bg-red-300 text-black cursor-pointer';
    }
  }
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
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search something.." /> 
      </div>
  </div>
        </div>
        <div className="flex justify-center">
  <div className="mb-4 xl:w-96">
    <select className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      defaultValue={'DEFAULT'}
      onChange={(e) => changeFilter(e.target.value)} 
      >
        <option value="DEFAULT" disabled>Filter Tasks</option>
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
    </select>
  </div>
</div>
<div className="flex justify-center">
  <div className="bg-white rounded-lg border border-gray-200 w-5/6 text-gray-900">
        { getToDos().filter((value)=>{
          if(searchtext===""){
            return value
          }else if(value.text.toLowerCase().includes(searchtext.toLowerCase())){
            return value
          }
        }).map((todo) => (
          
            <div key={todo._id+todo.text} aria-current="true" className={todoClassName(todo.checked)} onClick={() => toggleToDo(todo._id)} id={todo._id+todo.text} checked={todo.checked}>
                <label htmlFor={todo._id+todo.text}>{todo.text}</label>
                {(filter==="Completed" && (todo._id!==null))&&(
                    <button className="custom_del" onClick={del_task} value={todo._id}>Del</button>
                )}
            </div>
            
        ))}
        </div>
          </div>
        <form onSubmit={addToDo}>
        {(filter!=="Completed")&&(
          <div className="container px-5 py-12 mx-auto">
         
          <input
              placeholder="Enter the task you want to add and press enter"
              type="text" value={todotext} onChange={(e) =>  setToDoText(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
      </div>
       
        )}
        </form>
        {(filter==="Completed")&&(
          <div className="flex p-6 justify-center">
            <button data-mdb-ripple="true"
    data-mdb-ripple-color="light"
    className="inline-block px-6 py-2.5 bg-red-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out" onClick={del_all_task}>Del All</button>
          </div>
        )}
    
    </>
  )


}

export default Todo;