import { ToggleButton, Button, Card } from "react-bootstrap";
import './taskItem.scss';
import { useRef } from "react";


const TaskItem = (props) => {
    const { id, description, isCompleted, onDelete, onTaskUpdate } = props;
    const descriptionStyle = {
        color: isCompleted ? "#f6f6f6" : "#000",
        background: isCompleted ? "rgb(25, 135, 84)" : "inherit",
    }
    const textareaRef = useRef();
    const onFocusLost = (event) => {
        const value = event.target.value;
        if (value.trim() === "" || value === undefined || value === description) {
            textareaRef.current.value = description;
            return;
        }
        onTaskUpdate({ id, description: value, isCompleted })
    }

    return (
        <Card className="task" bg={isCompleted ? "success" : null}>
            <h2 style={{ display: "block", width: "100%" }} className="task__description">
                <textarea type="text" style={descriptionStyle} defaultValue={description}
                    ref={textareaRef}
                    onBlur={onFocusLost} />
            </h2>
            <div className="task__actions">
                <ToggleButton
                    id={"toggle-check-" + id}
                    type="checkbox"
                    variant="outline-primary"
                    checked={isCompleted}
                    onChange={() => onTaskUpdate({ id, description, isCompleted: !isCompleted })}
                    value="1">{isCompleted ? "Completed" : "Complete"}</ToggleButton>
                <Button
                    variant="danger"
                    onClick={() => onDelete(id)}>Delete</Button>
            </div>
        </Card>
    )
}

export default TaskItem;