
import { useState } from 'react';
import './App.css';
import GoalList from './components/GoalList';
import NewGoal from './components/NewGoal';


function App() {

  const [courseGoals,setCourseGoals]=useState ([
    {id:1,text:" Finish the course"},
    {id:2,text:" Learn all about the course main topic"},
    {id:3,text:" getting money after it"}
  ])

  const addNewGoalHandeler = (new_goal) =>{
    setCourseGoals(prev=>[...prev,new_goal])
    console.log(courseGoals)
  }

  return (
    <div className="course-goals">
      <h1>Course Goals</h1>
      <NewGoal addGoal={addNewGoalHandeler}/>
      <GoalList goals={courseGoals}/>
    </div>
  );
}

export default App;
