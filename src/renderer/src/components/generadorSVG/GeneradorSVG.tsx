export function GeneradorSVG({color}): JSX.Element {
  return (
    <div className="App">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
        <g transform="rotate(90 50 50)">
          <polygon points="20,20 80,20 50,50" fill={color} />
          <polygon points="20,80 80,80 50,50" fill={color} />
        </g>    
      </svg>
    </div>
  )
}
      