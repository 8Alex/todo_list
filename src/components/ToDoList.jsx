import { useState, useEffect, useRef } from "react";
import TodoItem from "./ToDoItem";
import dayjs from "dayjs";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../assets/styles/toDoList.less";

const TodoList = () => {
  const [arrayToDo, setArrayToDo] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [file, setFile] = useState("");
  const ref = useRef();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const todos = collection(db, "todos");
    const q = query(todos, orderBy("date"));
    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setArrayToDo(newData);
    });
  };

  const handleChangeText = (event) => {
    setTextInput(event.target.value);
  };

  const handleChangeDate = (event) => {
    setDateInput(event.target.value);
  };

  function handleUpload(event) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = () => {
      setFile(fileReader.result);
    };
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      task: textInput,
      date: dateInput,
      file: file,
    };

    await addDoc(collection(db, "todos"), data)
      .then((todo) => {
        const newItemArray = [...arrayToDo];
        data.id = todo.id;
        newItemArray.push(data);
        setArrayToDo(newItemArray);
        setTextInput("");
        setDateInput("");
        ref.current.value = "";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateList = async (updateTask, id) => {
    await updateDoc(doc(db, "todos", `${id}`), {
      task: `${updateTask}`,
    })
      .then(() => {
        const updateArrayToDo = [...arrayToDo];
        const updateItemToDo = updateArrayToDo.find((item) => item.id === id);
        updateItemToDo.task = updateTask;
        setArrayToDo(updateArrayToDo);
        console.log("Task has been updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", `${id}`))
      .then(() => {
        setArrayToDo(arrayToDo.filter((item) => item.id !== id));
        console.log("Task has been deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='planner__container'>
      <h1 className='planner__title'>Планер</h1>
      <form className='planner__form' onSubmit={handleSubmit}>
        <label htmlFor='text'>Задача:</label>
        <input
          className='planner__input'
          type='text'
          name='text'
          value={textInput}
          placeholder='Что нужно сделать...'
          onChange={handleChangeText}
          data-name={"text"}
          required
        />
        <label htmlFor='calendar'>Срок выполнения задачи:</label>
        <input
          className='planner__input'
          type='date'
          name='calendar'
          value={dateInput}
          onChange={handleChangeDate}
          data-name={"date"}
          min={dayjs().format("YYYY-MM-DD")}
          required
        />
        <label htmlFor='file'>Выберите файл:</label>
        <input
          className='planner__input'
          type='file'
          name='file'
          onChange={handleUpload}
          ref={ref}
        />
        <button className='planner__btn'>Добавить</button>
      </form>
      <div>
        <h2>Список задач</h2>
        {arrayToDo && arrayToDo.length > 0 ? (
          arrayToDo.map((item, index) => (
            <TodoItem
              key={item.id}
              task={item.task}
              title={index + 1}
              date={item.date}
              id={item.id}
              onUpdate={handleUpdateList}
              onDelete={() => handleDelete(item.id)}
              url={item.file}
            />
          ))
        ) : (
          <div>Список пуст!</div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
