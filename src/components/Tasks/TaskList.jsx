import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";

import AcceptTasks from "./AcceptTasks";

import NewTasks from "./NewTasks";

import CompleteTasks from "./CompleteTasks";

import FailedTasks from "./FailedTasks";

import toast from 'react-hot-toast';



const TaskList = ({ data }) => {

  const [userData, setUserData] = useContext(AuthContext);



  const updateTaskStatus = (taskNumber, newStatus) => {

    try {

      // Create deep copy of userData

      const updatedUserData = JSON.parse(JSON.stringify(userData));

      

      // Find current employee

      const employeeIndex = updatedUserData.findIndex(user => user.id === data.id);

      

      if (employeeIndex !== -1) {

        // Find and update the specific task

        const taskIndex = updatedUserData[employeeIndex].tasks.findIndex(

          task => task.taskNumber === taskNumber

        );



        if (taskIndex !== -1) {

          // Update task status

          updatedUserData[employeeIndex].tasks[taskIndex] = {

            ...updatedUserData[employeeIndex].tasks[taskIndex],

            ...newStatus

          };



          // Recalculate task counts

          const tasks = updatedUserData[employeeIndex].tasks;

          updatedUserData[employeeIndex].taskCounts = {

            active: tasks.filter(t => t.active).length,

            completed: tasks.filter(t => t.completed).length,

            newTask: tasks.filter(t => t.newTask).length,

            failed: tasks.filter(t => t.failed).length,

          };



          // Update context and localStorage for all employees

          setUserData(updatedUserData);

          localStorage.setItem('employees', JSON.stringify(updatedUserData));

          

          // Update loggedInUser without changing the login state

          const updatedEmployee = updatedUserData[employeeIndex];

          const currentLoggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

          const updatedLoggedInUser = {

            ...currentLoggedInUser,

            tasks: updatedEmployee.tasks,

            taskCounts: updatedEmployee.taskCounts

          };

          localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));



          // Show success message

          toast.success('Task status updated successfully!', {

            style: {

              border: '1px solid #00ff00',

              padding: '16px',

              background: '#000',

              color: '#fff',

            },

          });

        }

      }

    } catch (error) {

      console.error('Error updating task status:', error);

      toast.error('Failed to update task status', {

        style: {

          border: '1px solid #ff0000',

          padding: '16px',

          background: '#000',

          color: '#fff',

        },

      });

    }

  };



  return (

    <div className="card mt-8 p-6">

      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Your Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px] pr-2">

        {data.tasks?.map((element, index) => {

          if (element.newTask) {

            return (

              <NewTasks 

                key={`new-${element.taskNumber}`}

                data={element} 

                employeeData={data}

                updateTaskStatus={updateTaskStatus}

              />

            );

          }

          if (element.active) {

            return (

              <AcceptTasks 

                key={`active-${element.taskNumber}`}

                data={element} 

                employeeData={data}

                updateTaskStatus={updateTaskStatus}

              />

            );

          }

          if (element.completed) {

            return (

              <CompleteTasks 

                key={`complete-${element.taskNumber}`}

                data={element} 

              />

            );

          }

          if (element.failed) {

            return (

              <FailedTasks 

                key={`failed-${element.taskNumber}`}

                data={element} 

              />

            );

          }

          return null;

        })}

      </div>

    </div>

  );

};



export default TaskList;






























































