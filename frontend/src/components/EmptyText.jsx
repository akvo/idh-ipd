import React from 'react'
import { Result } from 'antd'

const EmptyText = ({ amount }) => {
  return amount === 0
    ? (
      <Result
        status="warning"
        title="You don’t have access to any company, Please contact admin"
      />
    )
    : <h1 className="no-data">Please select a Company</h1>
}

export default EmptyText
