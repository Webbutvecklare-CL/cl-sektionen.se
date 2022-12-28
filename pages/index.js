function Index() {
  return (
    <div>
      <div className="index_bg">
        <video autoPlay muted loop>
          <source src="/media/vid/cl_index_bg.mp4" type="video/mp4"></source>
        </video>
      </div>
      <div id="contentbody" className="index_content">
      <h1>
          Sektionen för Civilingenjör och Lärare
      </h1>
      <h2>
          Dubbel examen, dubbel kompetens
      </h2>
      </div>
    </div>
  )
}
export default Index