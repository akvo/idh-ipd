import React from 'react'
import ReactDOM from "react-dom";
import { Modal } from 'antd'
import RVerify from 'rverify'

const ModalVerify = () => {
  RVerify.configure({
    album: [
      'https://rverify.vercel.app/assets/1.jpg',
      'https://rverify.vercel.app/assets/2.jpg',
      'https://rverify.vercel.app/assets/3.jpg',
      'https://rverify.vercel.app/assets/4.jpg',
      'https://rverify.vercel.app/assets/5.jpg',
      'https://rverify.vercel.app/assets/6.jpg',
      'https://rverify.vercel.app/assets/7.jpg',
      'https://rverify.vercel.app/assets/8.jpg',
      'https://rverify.vercel.app/assets/9.jpg',
      'https://rverify.vercel.app/assets/10.jpg'
    ]
  });
  const captcha = React.createElement({
    type: 'div',
    props: { className: 'captcha' },
    children: RVerify.action()
  })
  return (
    <Modal visible={true} id="check">
      {ReactDOM.render(captcha, document.querySelector('#check'))}
    </Modal>
  )
}

export default ModalVerify