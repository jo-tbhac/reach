import React, { PureComponent } from 'react'

import Utils from '../Utils'
import ErrorMessage from './Error'
import '../css/Form.scss'

export default class ProjectForm extends PureComponent {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    const { action } = this.props
    this.action = action
    this.state = {
      name: '',
      description: '',
      errors: [],
    }
  }

  componentDidMount() {
    if (this.action === 'edit') {
      this.editProjectFormValue()
    }
  }

  editProjectFormValue = () => {
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}/edit`)
    fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    })
      .then((_res) => _res.json())
      .then(({ is_authenticated, project }) => {
        if (is_authenticated) {
          const { name, description } = project
          this.setState({ name, description })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  handleCreate = () => {
    const { name, description } = this.state
    const url = Utils.buildRequestUrl('/projects')
    const params = { name, description }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Reach-token': this.token },
      body: JSON.stringify(params),
    })
      .then((_res) => _res.json())
      .then((res) => {
        const { is_created, errors, project } = res
        if (is_created) {
          const { closeModal, refresh } = this.props
          refresh(project)
          closeModal()
        } else {
          this.setState({ errors })
        }
      })
      .catch(() => {
        // TODO
      })
  }

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onChangeDescription = (event) => {
    const description = event.target.value
    this.setState({ description })
  }

  onClickOverlay = (event) => {
    event.stopPropagation()
  }

  render() {
    const { closeModal } = this.props
    const { name, description, errors } = this.state
    const title = this.action === 'new' ? 'Create ' : 'Update '
    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.onClickOverlay}>
          <div className="modalForm__title">
            {title}
            Project
          </div>
          {errors.length !== 0 && <ErrorMessage action="Project creation" errors={errors} />}
          <input
            type="text"
            className="modalForm__textInput"
            placeholder="Type a project name"
            value={name}
            onChange={this.onChangeName}
          />
          <textarea
            className="modalForm__textarea"
            placeholder="Type a project description"
            value={description}
            onChange={this.onChangeDescription}
          />
          <button type="button" onClick={this.handleCreate} className="modalForm__button">
            {title}
          </button>
        </div>
      </div>
    )
  }
}
