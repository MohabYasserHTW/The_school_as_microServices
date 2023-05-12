import React, { useState } from 'react'

function NewGoal(props) {

    const [newGoal,setNewGoal] = useState("")

    const newGoalTextHandeler = (e)=>{
        setNewGoal(e.target.value)
    }

    const addGoalHandeler = (e)=>{
        e.preventDefault()
        
        const goal={
            id:Math.floor(Math.random()*100),
            text:newGoal
        }

        props.addGoal(goal)
        setNewGoal("")
    }


  return (
    <form className='new-goal' onSubmit={addGoalHandeler}>
        <input type='text' onChange={newGoalTextHandeler} value={newGoal}/>
        <button type='submit'>Add Goal</button>
    </form>
  )
}

export default NewGoal