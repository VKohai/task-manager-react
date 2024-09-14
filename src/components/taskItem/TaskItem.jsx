import { ToggleButton, Button, Card } from "react-bootstrap";
import './taskItem.scss';


const TaskItem = (props) => {
    const { id, description, isCompleted, onDelete, onComplete } = props;
    const descriptionStyle = {
        color: isCompleted ? "#f6f6f6" : "#000",
        background: isCompleted ? "rgb(25, 135, 84)" : "inherit",
    }

    const onFocusLost = (event) => {
        const value = event.target.value;
        if (value.trim() === "" || value === undefined || value === description) {
            return;
        }

    }

    return (
        <Card className="task" bg={isCompleted ? "success" : null}>
            {/* <h2 className="task__description" style={{ color: isCompleted ? "#f6f6f6" : "#000" }}>{description}</h2> */}
            <h2 style={{ display: "block", width: "100%" }} className="task__description">
                <textarea type="text" style={descriptionStyle} defaultValue={description} />
            </h2>
            <div className="task__actions">
                <ToggleButton
                    id={"toggle-check-" + id}
                    type="checkbox"
                    variant="outline-primary"
                    checked={isCompleted}
                    onChange={() => onComplete(id)}
                    value="1">{isCompleted ? "Completed" : "Complete"}</ToggleButton>
                <Button
                    variant="danger"
                    onClick={() => onDelete(id)}>Delete</Button>
            </div>
        </Card>
    )
}

export default TaskItem;