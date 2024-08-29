import React from 'react'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './Links.css'

function Links() {
  return (
    <div className='linksContainer'>
      <a className='whatsappLink' target='_blank' href='https://wa.link/aise6l'>
        <WhatsAppIcon className='linksIcons'/>
      </a>
    </div>
  )
}

export default Links