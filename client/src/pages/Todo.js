import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react'
import axios from 'axios';
import './styles.todo.css';

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
  return (
    <div className="todo">
        <h1 className='heading'>ToDo List</h1>
        <div>
          <input type="text" placeholder="Search for task..." onChange={(e) => setSearchText(e.target.value)}/>
        </div>
        <div className="select_tag">
            <select onChange={(e) => changeFilter(e.target.value)} className="custom_select">
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
        </div>
        { getToDos().filter((value)=>{
          if(searchtext===""){
            return value
          }else if(value.text.toLowerCase().includes(searchtext.toLowerCase())){
            return value
          }
        }).map((todo) => (
            <div key={todo._id+todo.text} className="todo-list">
                <input onChange={() => toggleToDo(todo._id)} id={todo._id+todo.text} checked={todo.checked} className="to-do-check" type="checkbox"/>
                <label htmlFor={todo._id+todo.text}>{todo.text}</label>
                {(filter==="Completed" && (todo._id!==null))&&(
                    <button className="custom_del" onClick={del_task} value={todo._id}>Del</button>
                )}
            </div>
        ))}
        <form onSubmit={addToDo}>
        {(filter!=="Completed")&&(
        <input placeholder="Enter the task you want to add and press enter" type="text" value={todotext} onChange={(e) =>  setToDoText(e.target.value)}/>
        )}
        </form>
        {(filter==="Completed")&&(
          <div className="custom_delall">
            <button onClick={del_all_task}>Del All</button>
          </div>
        )}
    </div>
  )


}

export default Todo;