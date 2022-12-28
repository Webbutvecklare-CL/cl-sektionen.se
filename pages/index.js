import Image from 'next/image'
import bg from '../public/media/img/KTHcover.jpg'

function Index() {
  return (
    <div>
      <div className="index_bg">
        <Image
          src={bg}
          alt="Bakgrundsbild KTH"
          fill
        />
      </div>
      <div className='bg_bottom_cover'></div>
      <div id="contentbody" className="index_content">
      <h1>
          Sektionen för Civilingenjör och Lärare
      </h1>
      <h2>
          Dubbel examen, dubbel kompetens
      </h2>
      <div className='aktuellt'></div>
      </div>
    </div>
  )
}
export default Index