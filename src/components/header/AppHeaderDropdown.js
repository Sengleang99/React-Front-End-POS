import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
} from '@coreui/react'
import {
  cilBell,

} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownMenu className="pt-0" placement="bottom-end">
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
