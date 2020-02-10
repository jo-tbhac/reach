export const OPEN_TASK_FORM = 'OPEN_TASK_FORM';
export const CLOSE_TASK_FORM = 'CLOSE_TASK_FORM';

export const openTaskForm = ({ projectID = null, taskID = null }) => ({
  type: OPEN_TASK_FORM,
  payload: { projectID, taskID },
});

export const closeTaskForm = () => ({
  type: CLOSE_TASK_FORM,
});
