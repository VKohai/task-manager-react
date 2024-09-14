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
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        onRequest(true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (init) => {
        if (init) {
            setInitialLoading(true);
        }
        getAllTasks()
            .then(setTasks)
            .catch(console.log)
            .finally(() => setInitialLoading(false));
    }

    useEffect(() => {
        const errorMsgId = setTimeout(() => clearError(), 3000);

        return () => clearTimeout(errorMsgId);
    }, [error]);

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

    const onTaskUpdate = async (task) => {
        // let - созание переменной, котоую можно менять после инициализации
        // const - создание переменной, которую ОБЯЗАТЕЛЬНО надо иницилизировать при создании и НЕЛЬЗЯ менять в дальнейшем
        let index;
        const items = [...tasks]; // Копируем массив
        try {
            for (index = 0; index < tasks.length; ++index) {
                // Ищем по Id в объекте с полученным объектом
                if (items[index].id === task.id) {
                    await updateTask(task);
                    // Выходим из цикла
                    break;
                }
            }
            if (index === tasks.length)
                return;

            // Заменяем массив в состояние на копию
            items[index].isCompleted = task.isCompleted;
            items[index].description = task.description;
            setTasks(items);
        } catch (error) {
            console.log(error);
        }
    }

    const errMsg = error ? < ErrorMessage msg={error} /> : null;
    const spinner = loading && initialLoading ? <Spinner /> : null;
    const content = (loading || error) ? null : tasks.map((task) =>
        <li key={task.id}>
            <TaskItem {...task}
                onDelete={onDelete}
                onTaskUpdate={onTaskUpdate} />
        </li>
    );

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
                        {content}{errMsg}{spinner}
                    </ul>
                </Row>
            </Container>
        </section>
    )
}

export default TaskList;