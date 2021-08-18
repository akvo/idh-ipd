import React from 'react';
import RVerify from 'rverify';
import { Modal, notification } from 'antd';
import api from '../lib/api';

const handleUserStore = () => {
  api.post('/user/')
  .then(() => {
    Modal.success({
      title: 'Success!',
      content: 'Registration process has been completed. Please wait until admin approves your registration.',
      onOk: () => {
        window.location.reload()
      }
    })
  })
  .catch((error) => {
    const { status } = error.response;
    if (status !== 200) {
      notification.error({
        title: 'Whoops',
        message: 'Sorry, we have errors in our system',
      });
    }
    return false;
  })
}

const onShow = () => {
  RVerify.action(res => {
    if(res === 1) handleUserStore()
  })
}

const ButtonVerify = React.forwardRef((props, ref) => {
  return <button type="button" onClick={onShow} ref={ref} {...props} style={{ display: 'none' }}></button>
})

export default ButtonVerify