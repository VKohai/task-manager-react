import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';

import TaskItem from '../taskItem/TaskItem';
import "./taskList.scss";
import TaskManagerService from '../../services/TaskManagerService';

function TaskList() {
    const [description, setDescription] = useState("");
    // Массив объектов задач
    const [tasks, setTasks] = useState([])
    const [lastId, setLastId] = useState(0);

    function onInputChange(event) {
        const value = event.target.value;
        setDescription(value);
    }

    async function onAdd() {
        if (description.trim() === "" || description === undefined) {
            return;
        }

        try {
            // Создаем объект задач
            const item = {
                id: lastId,
                description: description,
                isCompleted: false
            };
            setLastId(lastId => lastId + 1);

            // Сохраняем в массив через деструктуризацию элементов массива
            setTasks([...tasks, item]);
            setDescription("");
        } catch (error) {
            console.log(error);
        }
    }

    const onDelete = (id) => {
        const newArr = tasks.filter((item) => {
            return id !== item.id;
        });
        setTasks(newArr);
    }

    const onComplete = (id) => {
        // let - созание переменной, котоую можно менять после инициализации
        // const - создание переменной, которую ОБЯЗАТЕЛЬНО надо иницилизировать при создании и НЕЛЬЗЯ менять в дальнейшем

        const items = [...tasks]; // Копируем массив
        for (let index = 0; index < tasks.length; ++index) {
            // Ищем по Id в объекте с полученным объектом
            if (items[index].id === id) {
                // Меняем свойство isCompleted на противоположное значение через знак отрицания !
                items[index].isCompleted = !items[index].isCompleted;
                // Выходим из цикла
                break;
            }
        }
        // Заменяем массив в состояние на копию 
        setTasks(items);
    }

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
                        {
                            // Перебираем массив объектов задач (id, description)
                            // и перекидываем в props компоненту TaskItem
                            // также перекидываем функцию onDelete, чтобы удалять из состояния items элементы
                            tasks.map((task) =>
                                <li key={task.id}>
                                    <TaskItem {...task}
                                        onDelete={onDelete}
                                        onComplete={onComplete} />
                                </li>
                            )}
                    </ul>
                </Row>
            </Container>
        </section>
    )
}

export default TaskList;