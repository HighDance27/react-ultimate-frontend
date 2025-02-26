import { useState } from "react";

const TodoNew = (props) => {

    const [valueInput, setValueInput] = useState("Skibidi")

    const { addNewTodo } = props;
    // addNewTodo("Skibidi");
    const handleClick = () => {
        addNewTodo(valueInput)
        setValueInput("")
    }
    const handleOnChange = (name) => {
        setValueInput(name);
    }
    return (<div className='todo-new'>
        <input type="text" placeholder='Enter your task...'
            onChange={(event) => handleOnChange(event.target.value)}
            value={valueInput}
        />
        <button style={{ cursor: "pointer" }}
            onClick={handleClick}
        >Add</button>
        <div>My Input is = {valueInput}</div>
    </div>
    )
}
export default TodoNew;