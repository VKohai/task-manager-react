import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';

import TaskItem from '../taskItem/TaskItem';
import "./taskList.scss";
import useTaskService from '../../services/TaskService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Spinner } from 'react-bootstrap';

function TaskList() {
    const [description, setDescription] = useState("");
    // Массив объектов задач
    const [tasks, setTasks] = useState([])
    const { loading, error, clearError, getAllTasks, addTask, deleteTaskById, updateTask } = useTaskService();

    useEffect(() => {
        async function fetchData() {
            try {
                const dataOfTasks = await getAllTasks();
                setTasks(dataOfTasks);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const errorMsgId = setTimeout(() => clearError(), 3000);

        return () => clearTimeout(errorMsgId);
    }, [error])

    function onInputChange(event) {
        const value = event.target.value;
        setDescription(value);
    }

    async function onAdd() {
        if (description.trim() === "" || description === undefined) {
            return;
        }

        try {
            const item = await addTask(description, false);

            setTasks([...tasks, item]);
            setDescription("");
        } catch (error) {
            console.log(error);
        }
    }

    const onDelete = async (id) => {
        try {
            await deleteTaskById(id);
            const newArr = tasks.filter((task) => {
                return id !== task.id;
            });
            setTasks(newArr);
        } catch (error) {
            console.log(error);
        }
    }

    const onComplete = async (id) => {
        // let - созание переменной, котоую можно менять после инициализации
        // const - создание переменной, которую ОБЯЗАТЕЛЬНО надо иницилизировать при создании и НЕЛЬЗЯ менять в дальнейшем
        let index;
        const items = [...tasks]; // Копируем массив
        try {
            for (index = 0; index < tasks.length; ++index) {
                // Ищем по Id в объекте с полученным объектом
                if (items[index].id === id) {
                    // Меняем свойство isCompleted на противоположное значение через знак отрицания !
                    items[index].isCompleted = !items[index].isCompleted;
                    await updateTask(items[index]);
                    // Выходим из цикла
                    break;
                }
            }
            // Заменяем массив в состояние на копию 
            setTasks(items);
        } catch (error) {
            items[index].isCompleted = !items[index].isCompleted;
            console.log(error);
        }
    }

    const errMsg = error ? < ErrorMessage msg={error} /> : null;
    const taskItems = error ? null : tasks.map((task) =>
        <li key={task.id}>
            <TaskItem {...task}
                onDelete={onDelete}
                onComplete={onComplete} />
        </li>
    );
    const spinner = loading && !taskItems ? <Spinner /> : null;


    return (
        <section className="task-list">
            <Container>
                <Card className='bg-dark text-white' body>
                    <Row>
                        <Col md={12}>
                            <h1>Task Manager</h1>
                        </Col>
                    </Row>
                    <Row style={{ margin: "32px 0 0 0" }}>
                        <Col md={{ span: 10 }}>
                            <Form.Control size="lg" type="text" placeholder="Enter your task"
                                onChange={onInputChange}
                                value={description} />
                        </Col>
                        <Col>
                            <Button variant="outline-primary"
                                style={{ width: "100%", height: "100%" }}
                                onClick={onAdd}>Add Task</Button>
                        </Col>
                    </Row>
                </Card>
                <Row>
                    <ul className="task-list__items">
                        {taskItems}{errMsg}{spinner}
                    </ul>
                </Row>
            </Container>
        </section>
    )
}

export default TaskList;