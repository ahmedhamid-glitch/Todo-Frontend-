import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    Typography,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const navigate = useNavigate();




    const API_URL = "http://localhost:3001/api/todo";

    // Fetch tasks from the API on initial load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(API_URL, {
                    withCredentials: true,
                });

                const tasksWithDefaults = response.data.map((task) => ({
                    ...task,
                    completed: task.completed ?? false, // Ensure 'completed' is always present
                }));

                setTasks(tasksWithDefaults);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                if (error.response.status === 401) {
                    navigate("/signin");
                }
            }
        };

        fetchTasks();
    }, []);

    // Add or update task
    const handleAddTask = async () => {
        if (!title || !description) {
            alert("Title and description cannot be empty!");
            return;
        }

        if (editing) {
            const updatedTask = { _id: editId, title, description, completed: false };
            try {
                await axios.patch(`${API_URL}/${editId}`, updatedTask, {
                    withCredentials: true,
                });
                const updatedTasks = tasks.map((task) =>
                    task._id === editId ? updatedTask : task
                );
                setTasks(updatedTasks);
                setEditing(false);
                setEditId(null);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        } else {
            const newTask = { title, description, completed: false };
            try {
                const response = await axios.post(API_URL, newTask);

                setTasks([...tasks, newTask]);
            } catch (error) {
                console.error("Error creating task:", error);
            }
        }

        setTitle("");
        setDescription("");
    };

    // Delete task
    const handleDeleteTask = async (_id) => {
        try {
            await axios.delete(`${API_URL}/${_id}`); // DELETE request to remove the task
            const updatedTasks = tasks.filter((task) => task._id !== _id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Delete all tasks
    const handleDeleteAll = async () => {
        try {
            await axios.delete(API_URL); // Assuming there's an endpoint to delete all tasks
            setTasks([]);
        } catch (error) {
            console.error("Error deleting all tasks:", error);
        }
    };

    // Edit task
    const handleEditTask = (_id) => {
        const taskToEdit = tasks.find((task) => task._id === _id);
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setEditing(true);
        setEditId(_id);
    };

    // Toggle task completion
    const handleToggleComplete = async (_id) => {
        const updatedTasks = tasks.map((task) =>
            task._id === _id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);

        // Optionally, update completion status in the API
        try {
            const taskToUpdate = updatedTasks.find((task) => task._id === _id);
            await axios.patch(`${API_URL}/${_id}`, taskToUpdate); // PATCH request to update the task's completion status
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    return (
        <>

            <Box
                sx={{
                    flexDirection: "column",
                    textAlign: "center",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                    minWidth: "400px",
                    padding: "20px",
                    "border-radius": "15px",
                    border: "1px solid gray",

                    backgroundColor: "#f5f5f5",
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                    To-Do List
                </Typography>

                <TextField
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleAddTask}
                        sx={{ flexGrow: 1 }}
                    >
                        {editing ? "Edit Task" : "Add Task"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteAll}
                        sx={{ flexGrow: 1 }}
                    >
                        Delete All Tasks
                    </Button>
                </Box>

                <List sx={{ width: "100%" }}>
                    {tasks.map((task) => (
                        <ListItem
                            key={task._id}
                            divider
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <Checkbox
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task._id)}
                                sx={{ marginRight: 2 }} // Adds space between checkbox and text
                            />
                            <ListItemText
                                primary={task.title}
                                secondary={task.description}
                                sx={{
                                    textDecoration: task.completed ? "line-through" : "none",
                                }}
                            />
                            <IconButton edge="end" onClick={() => handleEditTask(task._id)}>
                                <Edit />
                            </IconButton>
                            <IconButton
                                edge="end"
                                onClick={() => handleDeleteTask(task._id)}
                            >
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

        </>
    );
};

export default TodoList;
