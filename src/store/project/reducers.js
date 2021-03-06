import {
  OPEN_PROJECT_FORM,
  CLOSE_PROJECT_FORM,
  GET_ALL_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  SEARCH_PROJECT,
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  INVALID_PROJECT_PARAMS,
} from './actions';

const initialProjectFormState = { visible: false, id: null, errors: [] };
const initialProjectState = { projects: [] };

export const projectFormReducer = (state = initialProjectFormState, action) => {
  switch (action.type) {
    case OPEN_PROJECT_FORM:
      return { visible: true, id: action.id, errors: [] };
    case CLOSE_PROJECT_FORM:
      return { visible: false, id: null, errors: [] };
    case INVALID_PROJECT_PARAMS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export const projectReducer = (state = initialProjectState, action) => {
  switch (action.type) {
    case GET_ALL_PROJECTS:
      return { projects: action.projects };

    case CREATE_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.project],
      };

    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => String(project.id) !== action.id),
      };

    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) => (
          project.id === action.project.id ? action.project : project
        )),
      };

    case SEARCH_PROJECT:
      return { projects: action.projects };

    case CREATE_TASK: {
      const targetProject = state.projects.filter((project) => (
        project.id === action.task.projectID
      ));
      if (targetProject[0].tasks === undefined) {
        targetProject[0].tasks = [action.task];
      } else {
        targetProject[0].tasks = [...targetProject[0].tasks, action.task];
      }
      return {
        ...state,
        projects: state.projects.map((project) => (
          project.id === targetProject[0].id ? targetProject[0] : project
        )),
      };
    }

    case DELETE_TASK: {
      const targetProject = state.projects.filter((project) => (
        project.id === action.task.projectID
      ));
      targetProject[0].tasks = targetProject[0].tasks.filter((task) => (
        task.id !== action.task.id
      ));
      return {
        ...state,
        projects: state.projects.map((project) => (
          project.id === targetProject[0].id ? targetProject[0] : project
        )),
      };
    }

    case UPDATE_TASK: {
      const targetProject = state.projects.filter((project) => (
        project.id === action.task.projectID
      ));
      targetProject[0].tasks = targetProject[0].tasks.map((task) => (
        task.id === action.task.id ? action.task : task
      ));
      return {
        ...state,
        projects: state.projects.map((project) => (
          project.id === targetProject[0].id ? targetProject[0] : project
        )),
      };
    }

    default:
      return state;
  }
};
