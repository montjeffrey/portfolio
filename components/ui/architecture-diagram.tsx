"use client";

export function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="1200" height="600" fill="#0D0D0D" />
        
        {/* Title */}
        <text
          x="600"
          y="40"
          textAnchor="middle"
          fill="#F0EDE4"
          fontSize="24"
          fontFamily="serif"
          fontWeight="bold"
        >
          Sports Analytics Architecture Flow
        </text>

        {/* Data Sources Layer */}
        <g id="data-sources">
          <rect x="50" y="100" width="200" height="80" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" />
          <text x="150" y="135" textAnchor="middle" fill="#E77D22" fontSize="14" fontWeight="bold">ESPN API</text>
          <text x="150" y="155" textAnchor="middle" fill="#F0EDE4" fontSize="12">Stats & Scores</text>
          
          <rect x="300" y="100" width="200" height="80" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" />
          <text x="400" y="135" textAnchor="middle" fill="#E77D22" fontSize="14" fontWeight="bold">Odds APIs</text>
          <text x="400" y="155" textAnchor="middle" fill="#F0EDE4" fontSize="12">Market Prices</text>
        </g>

        {/* Arrow to Pipeline */}
        <path
          d="M 550 140 L 650 140"
          stroke="#E77D22"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Python Cleaning Pipeline */}
        <g id="pipeline">
          <rect x="650" y="100" width="200" height="80" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" />
          <text x="750" y="130" textAnchor="middle" fill="#E77D22" fontSize="14" fontWeight="bold">Celery + Postgres</text>
          <text x="750" y="150" textAnchor="middle" fill="#F0EDE4" fontSize="11">Ingest &amp; Validate</text>
          <text x="750" y="165" textAnchor="middle" fill="#F0EDE4" fontSize="11">Nightly Grading</text>
        </g>

        {/* Arrow to Model */}
        <path
          d="M 850 140 L 950 140"
          stroke="#E77D22"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Random Forest Model */}
        <g id="model">
          <rect x="950" y="100" width="200" height="80" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" />
          <text x="1050" y="130" textAnchor="middle" fill="#E77D22" fontSize="14" fontWeight="bold">Prop Models</text>
          <text x="1050" y="150" textAnchor="middle" fill="#F0EDE4" fontSize="11">ML Model</text>
          <text x="1050" y="165" textAnchor="middle" fill="#F0EDE4" fontSize="11">Calibrated vs. Market</text>
        </g>

        {/* Arrow down to React UI */}
        <path
          d="M 1050 180 L 1050 280"
          stroke="#E77D22"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* React UI */}
        <g id="ui">
          <rect x="850" y="280" width="400" height="100" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" />
          <text x="1050" y="310" textAnchor="middle" fill="#E77D22" fontSize="14" fontWeight="bold">Publish Gate</text>
          <text x="1050" y="330" textAnchor="middle" fill="#F0EDE4" fontSize="11">Edge Required</text>
          <text x="1050" y="345" textAnchor="middle" fill="#F0EDE4" fontSize="11">Market-Priced Fallback</text>
          <text x="1050" y="360" textAnchor="middle" fill="#F0EDE4" fontSize="11">Closing-Line Audit</text>
        </g>

        {/* Side processes */}
        <g id="side-processes">
          {/* Accuracy Tracking */}
          <rect x="50" y="280" width="180" height="60" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" opacity="0.7" />
          <text x="140" y="305" textAnchor="middle" fill="#E77D22" fontSize="12" fontWeight="bold">Brier vs. Market</text>
          <text x="140" y="325" textAnchor="middle" fill="#F0EDE4" fontSize="10">Out-of-Sample Scoring</text>
          
          {/* Caching */}
          <rect x="50" y="360" width="180" height="60" rx="8" fill="#1A1A1A" stroke="#E77D22" strokeWidth="2" opacity="0.7" />
          <text x="140" y="385" textAnchor="middle" fill="#E77D22" fontSize="12" fontWeight="bold">Credit Budget</text>
          <text x="140" y="405" textAnchor="middle" fill="#F0EDE4" fontSize="10">Paid Calls Gated</text>
        </g>

        {/* Arrows from side processes */}
        <path
          d="M 230 310 L 650 140"
          stroke="#E77D22"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.5"
        />
        <path
          d="M 230 390 L 650 140"
          stroke="#E77D22"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.5"
        />

        {/* Arrowhead marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#E77D22" />
          </marker>
        </defs>

        {/* Labels for layers */}
        <text x="150" y="80" textAnchor="middle" fill="#F0EDE4" fontSize="12" opacity="0.7">Data Sources</text>
        <text x="750" y="80" textAnchor="middle" fill="#F0EDE4" fontSize="12" opacity="0.7">Processing</text>
        <text x="1050" y="80" textAnchor="middle" fill="#F0EDE4" fontSize="12" opacity="0.7">Model</text>
        <text x="1050" y="260" textAnchor="middle" fill="#F0EDE4" fontSize="12" opacity="0.7">Publication</text>
      </svg>
    </div>
  );
}

