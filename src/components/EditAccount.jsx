import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as accountActions from '../store/account/actions';
import * as projectActions from '../store/project/actions';
import ErrorMessage from './Error';
import Confirm from './Confirm';
import Utils from '../utils/Utils';
import { reload, serverError } from '../utils/Text';
import '../css/Session.scss';

const mapStateToProps = (state) => {
  const { accountForm } = state;
  return {
    errors: accountForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeAccountForm, updateAccount } = accountActions;
  const { getAllProjects } = projectActions;
  return {
    closeAccountForm: () => dispatch(closeAccountForm()),
    updateAccount: (params) => dispatch(updateAccount(params)),
    getAllProjects: () => dispatch(getAllProjects()),
  };
};

class EditAccuount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      avatar: null,
      name: '',
      email: '',
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  componentDidMount() {
    this.getCurrentAccount();
  }

  getCurrentAccount = async () => {
    const url = Utils.buildRequestUrl('/users/edit');
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
      return;
    }
    const { avatar, name, email } = response.data.user;
    this.setState({ uri: avatar, name, email });
  }

  handleUpdate = async () => {
    const { avatar, name, email } = this.state;
    const params = new FormData();
    params.append('user[name]', name);
    params.append('user[email]', email);
    if (avatar) {
      params.append('user[avatar]', avatar);
    }

    const { getAllProjects, updateAccount } = this.props;
    await updateAccount(params);
    getAllProjects();
  }

  onChangeFile = (event) => {
    const avatar = event.target.files[0];
    const uri = URL.createObjectURL(avatar);
    this.setState({ uri, avatar });
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeEmail = (event) => {
    const email = event.target.value;
    this.setState({ email });
  }

  openConfirm = (type, title, description, confirm) => {
    this.setState({
      confirmVisible: true,
      confirmType: type,
      confirmTitle: title,
      confirmDescription: description,
      confirm,
    });
  }

  closeConfirm = () => this.setState({ confirmVisible: false })

  onClickOverlay = (event) => event.stopPropagation()

  render() {
    const { closeAccountForm, errors } = this.props;
    const {
      uri,
      name,
      email,
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      <div className="background--edit" onClick={closeAccountForm}>
        <div className="session--edit" onClick={this.onClickOverlay}>
          <div className="session__title">Edit account</div>
          {errors.length !== 0 && <ErrorMessage action="Registration" errors={errors} />}
          <label htmlFor="avatarForm" className="session__avatar">
            <input
              id="avatarForm"
              type="file"
              className="session__fileField"
              onChange={this.onChangeFile}
            />
            {uri === ''
              ? <FontAwesomeIcon icon={['fas', 'user']} className="session__fileIcon" />
              : <img src={uri} alt="avatar" className="session__preview" />}
          </label>
          <div className="session__fileLabel">Upload your avatar</div>
          <input
            type="text"
            className="session__name"
            placeholder="Name"
            value={name}
            onChange={this.onChangeName}
          />
          <input
            type="text"
            className="session__email"
            placeholder="Email"
            value={email}
            onChange={this.onChangeEmail}
          />
          <button type="button" onClick={this.handleUpdate} className="session__submit">
            Update
          </button>
        </div>
        {confirmVisible && (
          <Confirm
            type={confirmType}
            closeConfirm={this.closeConfirm}
            title={confirmTitle}
            description={confirmDescription}
            confirm={confirm}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccuount);
