import React from 'react'

function Map() {
    return (
        <div style={{height:'30rem',maxWidth:'50rem',display:'flex',flexWrap:'wrap',marginInline:'auto'}} id='map'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59540.376691218!2d72.7089385216797!3d21.14150960000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05327ccb9c45f%3A0xe73ce99228e97293!2sKOE%20-%20The%20Kafe!5e0!3m2!1sen!2sqa!4v1704047040883!5m2!1sen!2sqa" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{height:'100%',width:'100%'}}></iframe>
        </div>
    )
}

export default Map