import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as actions from '../store/task/actions';
import Confirm from './Confirm';
import Utils from '../utils/Utils';
import {
  badRequest,
  checkParams,
  reload,
  serverError,
} from '../utils/Text';

import '../css/Task.scss';

const mapStateToProps = (state) => {
  const { task } = state;
  return {
    deleteButtonVisible: task.deleteButtonVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openTaskForm } = actions;
  return {
    openTaskForm: ({ taskID }) => dispatch(openTaskForm({ taskID })),
  };
};

const Avatars = ({ members }) => (
  members.map((member, i) => {
    if (i > 3) {
      return null;
    }
    if (i < 3) {
      return <img key={member.name} src={member.avatar} alt={member.name} className="task__avatar" />;
    }
    return <div key={String(i)} className="task__avatar--length">{members.length}</div>;
  })
);

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmVisible: false,
      confirmType: '',
      confirmTitle: '',
      confirmDescription: '',
      confirm: () => {},
    };
  }

  handleDestroy = async (event) => {
    event.stopPropagation();
    this.token = localStorage.getItem('token');
    const { id } = event.currentTarget.dataset;
    const url = Utils.buildRequestUrl(`/tasks/${id}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'X-Reach-token': this.token },
    }).catch(() => {
      this.openConfirm('error', serverError, reload, this.closeConfirm);
    });

    const { is_delete, task } = await response.json();
    if (is_delete) {
      const { index, refresh } = this.props;
      refresh(task, index, 'destroy');
    } else {
      this.openConfirm('error', badRequest, checkParams, this.closeConfirm);
    }
  }

  onClick = (event) => {
    const { openTaskForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openTaskForm({ taskID: id });
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
    const { tasks, deleteButtonVisible } = this.props;
    const {
      confirmVisible,
      confirmType,
      confirmTitle,
      confirmDescription,
      confirm,
    } = this.state;

    return (
      tasks.map((task) => {
        const className = task.percentComplete === 'progress' ? 'task' : 'task--complete';
        return (
          <div key={task.id} data-id={task.id} className={className} onClick={this.onClick}>
            <div className="task__icon" onClick={this.onClickOverlay}>
              {deleteButtonVisible ? (
                <FontAwesomeIcon
                  data-id={task.id}
                  icon={['fas', 'minus-circle']}
                  className="task__delete"
                  onClick={this.handleDestroy}
                />
              ) : <div className="task__resource" style={{ backgroundColor: task.resource.color }} />}
            </div>
            <div className="task__name">{task.name}</div>
            <div className="task__startDate">{task.startDate}</div>
            <div className="task__endDate">{task.endDate}</div>
            <div className="task__extend">{task.extend}</div>
            <div className="task__duration">{task.duration}</div>
            <div className="task__inCharge">
              <Avatars members={task.users} />
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
      })
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
