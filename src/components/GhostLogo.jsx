const GhostLogo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-0.15 -0.15 7.3 7.3"
    width="28"
    height="28"
    fill="none"
    stroke="white"
    strokeWidth="0.12"
    strokeLinecap="square"
    className={className}
    role="img"
    aria-label="Destiny Ghost icon"
  >
    <title>Destiny Ghost</title>

    {/* Tinted fills */}
    <path d="M0,1.75 L2,1.75 L2,5.25 L0,5.25 L0,4.375 L1,4.375 L1,2.625 L0,2.625 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>
    <path d="M7,1.75 L5,1.75 L5,5.25 L7,5.25 L7,4.375 L6,4.375 L6,2.625 L7,2.625 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>
    <path d="M2,1.75 L3,1.75 L3,2.625 L4,2.625 L4,1.75 L5,1.75 L5,3.5 L2,3.5 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>
    <path d="M2,3.5 L5,3.5 L5,5.25 L4,5.25 L4,4.375 L3,4.375 L3,5.25 L2,5.25 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>
    <path d="M0,0 L2,0 L2,0.875 L5,0.875 L5,0 L7,0 L7,1.75 L4,1.75 L4,2.625 L3,2.625 L3,1.75 L0,1.75 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>
    <path d="M0,7 L2,7 L2,6.125 L5,6.125 L5,7 L7,7 L7,5.25 L4,5.25 L4,4.375 L3,4.375 L3,5.25 L0,5.25 Z"
          fill="white" fillOpacity="0.25" stroke="none"/>

    {/* Outer boundary */}
    <line x1="0" y1="0" x2="0" y2="2.625"/>
    <line x1="7" y1="0" x2="7" y2="2.625"/>
    <line x1="0" y1="4.375" x2="0" y2="7"/>
    <line x1="7" y1="4.375" x2="7" y2="7"/>
    <line x1="0" y1="0" x2="2" y2="0"/>
    <line x1="5" y1="0" x2="7" y2="0"/>
    <line x1="0" y1="7" x2="2" y2="7"/>
    <line x1="5" y1="7" x2="7" y2="7"/>

    {/* Inner structure */}
    <line x1="2" y1="1.75" x2="2" y2="3.5"/>
    <line x1="5" y1="1.75" x2="5" y2="3.5"/>
    <line x1="3" y1="1.75" x2="3" y2="2.625"/>
    <line x1="4" y1="1.75" x2="4" y2="2.625"/>
    <line x1="3" y1="2.625" x2="4" y2="2.625"/>
    <line x1="3" y1="4.375" x2="3" y2="5.25"/>
    <line x1="4" y1="4.375" x2="4" y2="5.25"/>
    <line x1="0" y1="1.75" x2="3" y2="1.75"/>
    <line x1="4" y1="1.75" x2="7" y2="1.75"/>
    <line x1="0" y1="5.25" x2="3" y2="5.25"/>
    <line x1="4" y1="5.25" x2="7" y2="5.25"/>
    <line x1="2" y1="3.5" x2="2" y2="5.25"/>
    <line x1="5" y1="3.5" x2="5" y2="5.25"/>
    <line x1="2" y1="3.5" x2="5" y2="3.5"/>
    <line x1="3" y1="4.375" x2="4" y2="4.375"/>

    {/* Left and right notches */}
    <line x1="0" y1="2.625" x2="1" y2="2.625"/>
    <line x1="0" y1="4.375" x2="1" y2="4.375"/>
    <line x1="1" y1="2.625" x2="1" y2="4.375"/>
    <line x1="6" y1="2.625" x2="7" y2="2.625"/>
    <line x1="6" y1="4.375" x2="7" y2="4.375"/>
    <line x1="6" y1="2.625" x2="6" y2="4.375"/>

    {/* Top and bottom center tabs */}
    <line x1="2" y1="0.875" x2="5" y2="0.875"/>
    <line x1="2" y1="6.125" x2="5" y2="6.125"/>
    <line x1="2" y1="6.125" x2="2" y2="7"/>
    <line x1="5" y1="6.125" x2="5" y2="7"/>
    <line x1="2" y1="0" x2="2" y2="0.875"/>
    <line x1="5" y1="0" x2="5" y2="0.875"/>
  </svg>
);

export default GhostLogo;
