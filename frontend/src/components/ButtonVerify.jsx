import React from 'react';
import RVerify from 'rverify';
import { Modal, notification } from 'antd';
import api from '../lib/api';

const handleUserStore = (data) => {
  api.post('/user/', JSON.parse(data))
  .then(() => {
    Modal.success({
      title: 'Success!',
      content: 'Please wait for Admin Approval',
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

const onShow = (e) => {
  RVerify.action(res => {
    if(res === 1) handleUserStore(e.target.value)
  })
}

const ButtonVerify = React.forwardRef((props, ref) => {
  return <button type="button" onClick={(e) => onShow(e)} ref={ref} {...props} style={{ display: 'none' }}></button>
})

export default ButtonVerify