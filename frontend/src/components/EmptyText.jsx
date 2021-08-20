import React, { useEffect, useState } from 'react'
import { Result } from 'antd'
import Loading from './Loading'

const EmptyText = ({ amount }) => {
  const [show, setShow] = useState(false);
  const timeout = 500;
  const rprops = { status: "warning", title: "You don’t have access to any company, Please contact admin" }

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setShow(true);
      }, timeout);
    }
  }, [show]);
  if (!show) return <Loading />;
  return amount === 0 ? <Result {...rprops} /> : <h1 className="no-data">Please select a Company</h1>
}

export default EmptyText
