import React from 'react'

function BackToTop() {
  return (
    <a href="#top" className="back-top-btn active" aria-label="back to top" data-back-top-btn>
    <ion-icon name="chevron-up" aria-hidden="true"></ion-icon>
  </a>
  )
}

export default BackToTop;