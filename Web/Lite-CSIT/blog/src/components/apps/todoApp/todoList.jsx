import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  List,
  Modal,
  Form,
  Typography,
  Checkbox,
} from "antd";

import AppHeader from "../../apps/blogApp/header/header";
import AppFooter from "../../apps/blogApp/footer/footer";

const { Header, Content } = Layout;
const { Title } = Typography;
const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj = { id: Date.now(), text: newTask, completed: false };
      setNewTask("");
      updateLocalStorage([...tasks, newTaskObj]);
      setTasks((prevTasks) => [...prevTasks, newTaskObj]);
    }
  };

  const handleRemoveTask = (taskId) => {
    setSelectedTask({ id: taskId });
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks);
    setIsDeleteModalVisible(false);
    setSelectedTask(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setEditInput(task.text);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedTask(null);
    setEditInput("");
  };

  const handleEditTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, text: editInput } : task
    );
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks);
    setIsEditModalVisible(false);
    setSelectedTask(null);
    setEditInput("");
  };

  const handleCheckboxChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks);
  };

  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <>
      {" "}
      <AppHeader />
      <Layout style={{ padding: "0 15%", minHeight: "75vh" }}>
        <Title level={1}>Todo List</Title>

        <Content style={{ padding: "20px" }}>
          <Input
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button
            type="primary"
            ghost
            onClick={handleAddTask}
            style={{ marginTop: "10px", minWidth: "6rem" }}
          >
            Add Task
          </Button>
          <List
            style={{ marginTop: "20px" }}
            bordered
            dataSource={tasks}
            renderItem={(task, index) => (
              <List.Item
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
                actions={[
                  <Button type="primary" onClick={() => handleUpdateTask(task)}>
                    Update
                  </Button>,
                  <Button danger onClick={() => handleRemoveTask(task.id)}>
                    Remove
                  </Button>,
                ]}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleCheckboxChange(task.id)}
                >
                  {`${index + 1}. ${task.text}`}
                </Checkbox>
              </List.Item>
            )}
          />

          <Modal
            title="Edit Task"
            visible={isEditModalVisible}
            onOk={handleEditTask}
            onCancel={handleEditModalCancel}
          >
            <Form>
              <Form.Item label="Task">
                <Input
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Confirm Deletion"
            visible={isDeleteModalVisible}
            onOk={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          >
            <p>Are you sure you want to delete this task?</p>
          </Modal>
        </Content>
      </Layout>
      <AppFooter />
    </>
  );
};

export default TodoList;
