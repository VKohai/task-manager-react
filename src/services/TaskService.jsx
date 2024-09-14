import useHttp from "../hooks/useHttp.hook";

const useTaskService = () => {
    const { loading, error, request, clearError } = useHttp();
    const _API_URL = 'http://localhost:5030/api/ToDoItems';

    // Функция для получения задачи по id
    const getTaskById = async (id) => {
        const response = await request(`${_API_URL}/${id}`);
        return response.data;
    }

    // Функция для получения всех задач
    const getAllTasks = async () => {
        const response = await request(_API_URL);
        return response.data;
    }

    // Функция для обновления существующей задачи
    const updateTask = async (task) => {
        const response = await request(_API_URL, 'PUT', JSON.stringify(task));
        return response.data;
    }

    // Функция для удаления задачи по id
    const deleteTaskById = async (id) => {
        await request(`${_API_URL}?id=${id}`, 'DELETE');
    }

    // Функция для добавления новой задачи
    const addTask = async (description, isCompleted) => {
        const response = await request(
            `${_API_URL}?description=${encodeURIComponent(description)}&isCompleted=${isCompleted}`,
            'POST');
        return response.data;
    }

    return {
        loading, error, clearError,
        getTaskById, getAllTasks, updateTask, deleteTaskById, addTask
    };
}
export default useTaskService;