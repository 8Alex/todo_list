import { useState } from "react";
import dayjs from "dayjs";
import "../assets/styles/toDoItem.less";

const TodoItem = (props) => {
  const [edit, setEdit] = useState(false);
  const [updateTextInput, setupdateTextInput] = useState(props.task);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);

  const taskСompleted = checked ? "task__completed" : "";
  const disabledEdit = checked ? "btn__disabled" : "";
  const disabledSave = error ? "btn__disabled" : "";

  const handleChange = (event) => {
    setupdateTextInput(event.target.value);
    setError(event.target.value.length === 0);
  };

  const handleChangeCheckbox = () => {
    setChecked(!checked);
  };

  const handleEdit = () => {
    if (!checked) {
      setEdit(true);
    }
  };

  const handleSave = () => {
    if (!error) {
      props.onUpdate(updateTextInput, props.id);
      setEdit(false);
    }
  };

  const handleCancel = () => {
    setupdateTextInput(props.task);
    setEdit(false);
  };

  const handleDelete = () => {
    props.onDelete();
  };

  const handleOpenFile = () => {
    let win = window.open();
    win.document.write(
      '<iframe src="' +
        props.url +
        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );
  };

  if (edit) {
    return (
      <div>
        <div>
          <h3>Задача №{props.title}</h3>
          {dayjs().isBefore(dayjs(props.date), "day") ||
          dayjs().isSame(dayjs(props.date), "day") ? (
            <div className='item__date'>
              Выполнить к {dayjs(props.date).format("DD.MM.YYYY")}
            </div>
          ) : (
            <div className='item__date item__date_completed'>
              Дата завершения истекла {dayjs(props.date).format("DD.MM.YYYY")}
            </div>
          )}
        </div>
        <div className='item__input'>
          <input
            className='item__input_text'
            type='text'
            name='text'
            value={updateTextInput}
            onChange={handleChange}
          />
        </div>
        {updateTextInput?.length === 0 && (
          <div className='item__error'>Заполните поле</div>
        )}
        <button className={`item__btn ${disabledSave}`} onClick={handleSave}>
          Сохранить
        </button>
        <button className='item__btn' onClick={handleCancel}>
          Отмена
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <h3>Задача №{props.title}</h3>
          {dayjs().isBefore(dayjs(props.date), "day") ||
          dayjs().isSame(dayjs(props.date), "day") ? (
            <div className='item__date'>
              Выполнить к {dayjs(props.date).format("DD.MM.YYYY")}
            </div>
          ) : (
            <div className='item__date item__date_completed'>
              Дата завершения истекла {dayjs(props.date).format("DD.MM.YYYY")}
            </div>
          )}
        </div>
        <div className='item__input'>
          <input
            className='item__input_checkbox'
            type='checkbox'
            name='check'
            checked={checked}
            onChange={handleChangeCheckbox}
          />
          <label htmlFor='check' className={taskСompleted}>
            {props.task}
          </label>
        </div>
        {props.url && (
          <div className='item__file'>
            <button onClick={handleOpenFile}>Загрузить файл</button>
          </div>
        )}
        <button className={`item__btn ${disabledEdit}`} onClick={handleEdit}>
          Редактировать
        </button>
        <button className='item__btn' onClick={handleDelete}>
          Удалить
        </button>
      </div>
    );
  }
};

export default TodoItem;
