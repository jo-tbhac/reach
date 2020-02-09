import Utils from '../../utils/Utils';

export const OPEN_PROJECT_FORM = 'OPEN_PROJECT_FORM';
export const CLOSE_PROJECT_FORM = 'CLOSE_PROJECT_FORM';
export const GET_ALL_PROJECTS = 'GET_ALL_PROJESTS';

export const openProjectForm = (id = null) => ({
  type: OPEN_PROJECT_FORM,
  id,
});

export const closeProjectForm = () => ({
  type: CLOSE_PROJECT_FORM,
});

export const getAllProjects = () => async (dispatch) => {
  const url = Utils.buildRequestUrl('/projects');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-Reach-token': token },
  });

  const json = await response.json();
  if (json.is_authenticated) {
    dispatch(({ type: GET_ALL_PROJECTS, projects: json.projects }));
  }
};
