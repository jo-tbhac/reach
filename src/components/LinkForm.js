import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ErrorMessage from './Error'
import Confirm from './Confirm'
import Utils from '../utils/Utils'
import { badRequest, checkParams } from '../utils/Text'

import '../css/Form.scss'

export default class LinkForm extends Component {
  constructor(props) {
    super(props)
    this.token = localStorage.getItem('token')
    this.state = {
      attachments: [],
      name: '',
      link: '',
      errors: [],
      confirmVisible: false,
    }
  }

  componentDidMount() {
    this.handleIndex()
  }

  handleIndex = async () => {
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}/attachments`)
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm()
    })

    const { attachments, is_authenticated } = await response.json()
    if (is_authenticated) {
      this.setState({ attachments })
    } else {
      this.openConfirm()
    }
  }

  handleCreate = async () => {
    const { name, link, attachments } = this.state
    const { id } = this.props
    const url = Utils.buildRequestUrl(`/projects/${id}/attachments`)
    const params = { name, url: link }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'X-Reach-token': this.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).catch(() => {
      this.openConfirm()
    })

    const { is_created, errors, attachment } = await response.json()
    if (is_created) {
      const attachmentsCopy = attachments.slice()
      attachmentsCopy.push(attachment)
      this.setState({ attachments: attachmentsCopy })
    } else {
      this.setState({ errors })
    }
  }

  handleDestroy = async (event) => {
    const { id } = event.currentTarget.dataset
    const url = Utils.buildRequestUrl(`/attachments/${id}`)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm()
    })

    const isDelete = await response.json()
    if (isDelete) {
      const { attachments } = this.state
      const attachmentsCopy = attachments.filter((attachment) => (
        String(attachment.id) !== id
      ))
      this.setState({ attachments: attachmentsCopy })
    } else {
      this.openConfirm()
    }
  }

  openConfirm = () => this.setState({ confirmVisible: true })

  closeConfirm = () => this.setState({ confirmVisible: false })

  onChangeName = (event) => {
    const name = event.target.value
    this.setState({ name })
  }

  onChangeUrl = (event) => {
    const link = event.target.value
    this.setState({ link })
  }

  stopPropagation = (event) => event.stopPropagation()

  render() {
    const { closeModal } = this.props
    const {
      attachments,
      name,
      link,
      errors,
      confirmVisible,
    } = this.state

    return (
      <div className="modalOverlay" onClick={closeModal}>
        <div className="modalForm" onClick={this.stopPropagation}>
          <div className="modalForm__title">Attachments</div>
          {errors.length !== 0 && <ErrorMessage action="Add link" errors={errors} />}
          <div className="modalFormUrl">
            <input
              type="text"
              className="modalFormUrl__name"
              placeholder="Label"
              value={name}
              onChange={this.onChangeName}
            />
            <input
              type="text"
              className="modalFormUrl__url"
              placeholder="URL"
              value={link}
              onChange={this.onChangeUrl}
            />
            <FontAwesomeIcon
              icon={['fas', 'plus-circle']}
              className="modalFormUrl__add"
              onClick={this.handleCreate}
            />
          </div>
          <div className="urlIndex">
            {attachments.map((attachment) => (
              <div className="urlList" key={attachment.id}>
                <FontAwesomeIcon icon={['fas', 'link']} className="urlList__icon" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={attachment.url}
                  className="urlList__link"
                >
                  {attachment.name}
                </a>
                <FontAwesomeIcon
                  icon={['fas', 'trash-alt']}
                  className="urlList__delete"
                  data-id={attachment.id}
                  onClick={this.handleDestroy}
                />
              </div>
            ))}
          </div>
        </div>
        {confirmVisible && (
          <Confirm
            type="error"
            closeConfirm={this.closeConfirm}
            title={badRequest}
            description={checkParams}
            confirm={this.closeConfirm}
          />
        )}
      </div>
    )
  }
}
