import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; Copyright 2024 </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Developed By</span>
        <span  rel="noopener noreferrer">
          RNS Developers
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
