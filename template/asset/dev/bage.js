const fs = require('fs');
const path = require('path');

const color = (cov) => {
  if (cov === undefined) {
    return '#9f9f9f'
  } else if (cov < 20) {
    return '#e05d44'
  } else if (cov < 40) {
    return '#fe7d37'
  } else if (cov < 60) {
    return '#dfb317'
  } else if (cov < 70) {
    return '#a4a61d'
  } else if (cov < 80) {
    return '#97CA00'
  } else {
    return '#4c1'
  }
};

function gen(num) {
  const c = color(num);
  const str = num ? `${num}%` : 'unknown';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>

  <mask id="a">
    <rect width="120" height="20" rx="3" fill="#fff"/>
  </mask>

  <g mask="url(#a)">
    <path fill="#555" d="M0 0 h62 v20 H0 z"/>
    <path fill="${c}" d="M62 0 h58 v20 H62 z"/>
    <path fill="url(#b)" d="M0 0 h120 v20 H0 z"/>
  </g>

  <g fill="#fff" text-anchor="middle">
    <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
      <text x="31" y="15" fill="#010101" fill-opacity=".3">
        coverage
      </text>
      <text x="31" y="14">
        coverage
      </text>
      <text x="91" y="15" fill="#010101" fill-opacity=".3">
           ${str}
      </text>
      <text x="91" y="14">
        ${str}
      </text>
    </g>
  </g>
</svg>
`
}
const outpath = './coverage/html/bage.svg';

fs.readFile('./coverage/text.txt', 'utf8', (err, data) => {
  let m = data.match(/Statements\s*:\s*([^%]+)/);
  if (m) {
    let per = parseFloat(m[1]);
    fs.writeFileSync(outpath, gen(per), 'utf8')
  } else {
    fs.writeFileSync(outpath, gen(undefined), 'utf8')
  }
});


