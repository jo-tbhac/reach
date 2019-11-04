import React from 'react'
import '../css/Task.scss'

const Avatars = ({ members }) => (
  members.map((member) => (
    <img key={member.name} src={member.avatar} alt={member.name} className="task__avatar" />
  ))
)

const Task = (props) => (
  props.tasks.map((task) => (
    <div key={task.id} className="task">
      <div className="task__name">{task.name}</div>
      <div className="task__startDate">{task.startDate}</div>
      <div className="task__endDate">{task.endDate}</div>
      <div className="task__extend">{task.extend}</div>
      <div className="task__duration">{task.duration}</div>
      <div className="task__inCharge">
        <Avatars members={task.users} />
      </div>
    </div>
  ))
)

export default Task
