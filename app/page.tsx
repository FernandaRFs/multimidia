import './globals.css'

export default function Home() {
  return (
    <div className="music-player">
      <img src="/image.jpg" alt="Capa" className="cover" />
      <div className="title">sk8er boi</div>
      <div className="artist">Avril Lavigne</div>

      <div className="progress-bar">
        <div className="progress"></div>
      </div>

      <div className="time">
        <span>0:00</span>
        <span>0:00</span>
      </div>

      <div className="controls">
        <button>&laquo;</button>
        <button className="play-button">&#9658;</button>
        <button>&raquo;</button>
        <button>&#128266;</button>
      </div>
    </div>
  )
}
