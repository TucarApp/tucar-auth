import React from 'react'
import Password from '@/components/Auth/Password'
import Meta from '@/Layouts/Meta'


function changePassword() {
  return (
    <div>
      <Meta title='Cambiar contraseña' />
        <Password />
     
    </div>
  )
}

export default changePassword