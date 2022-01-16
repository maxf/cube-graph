const up = function(p) {
  return `${p[0]}${p[1]}${p[2]}${p[3]}${p[7]}${1 - p[6]}${1 - p[5]}${p[4]}${p[11]}${1 - p[10]}${1 - p[9]}${p[8]}`;
};

const down = function(p) {
  return `${p[0]}${p[1]}${p[2]}${p[3]}${p[4]}${p[5]}${p[6]}${p[7]}${p[11]}${1 - p[10]}${1 - p[9]}${p[8]}`;
}

const side = function(p) {
  return `${p[0]}${p[1]}${1 - p[10]}${p[11]}${p[4]}${p[5]}${1 - p[6]}${p[7]}${p[8]}${p[9]}${1 - p[2]}${p[3]}`;
}

const initialState = '111011101110';

const f = state => `${state.slice(0,4)} ${state.slice(4,8)} ${state.slice(8,12)}`;


const states = [];
const edges = [];

const addEdge = function(s, t, move) {
  if (s === t) return;
  const alreadyEdge = edges.filter(edge => (edge.source === s && edge.target === t) || (edge.source === t && edge.target === s));
  if (alreadyEdge.length === 0) edges.push({source: s, target: t, move});
};

const walk = function() {
  const queue = [];
  queue.push({ state: initialState, moves: '' });

  const checkNext = function(moveFn, state, moveLetter) {
    const next = moveFn(state.state);
    const alreadySeenIndex = states.map(state=>state.state).indexOf(next);
    if (alreadySeenIndex === -1) {
      queue.push({ state: next, moves: state.moves + moveLetter });
      addEdge(states.indexOf(state), states.length -1, moveLetter);
    } else {
      addEdge(states.indexOf(state), alreadySeenIndex, moveLetter);
    }
  };

  while (queue.length > 0) {
    const v = queue.shift();
    states.push(v);
    checkNext(up, v, 'U');
    checkNext(down, v, 'D');
    checkNext(side, v, 'S');
  }
//  console.log(states, edges);
};


let state = initialState;

const update = function(id) {
  switch (id) {
    case 'turn-up':
    state = up(state);
    break;
    case 'turn-down':
    state = down(state);
    break;
    case 'turn-side':
    state = side(state);
    break;
    case 'reset':
    state = initialState;
    break;
    case 'walk':
    walk();
    break;
    default:
    console.log(`bad message: ${id}`);
    break;
  }
  view(state, states);
};


const view = function(s, states) {
  document.getElementById('canvas').innerHTML = `
    ${viewConfig(s)}
    <section>
      <button id="turn-up">Up</button>
      <button id="turn-down">Down</button>
      <button id="turn-side">Side</button>
      <button id="reset">Reset</button>
      <button id="walk">Walk</button>
    </section>
    <hr/>
    ${viewStates(states)}
  `;

  document.querySelectorAll('button').forEach(e => e.addEventListener(
    'click',
    event => update(event.target.getAttribute('id'))
  ));

  if (states.length > 0) {
    showGraph(states, edges);
  }

}

const viewConfig = function(s) {
  return `
    <table>
      <tr><td class="side cell-${s[0]}">${s[0]}</td><td class="cell-${s[1]}">${s[1]}</td><td class="cell-${s[2]}">${s[2]}</td><td class="side cell-${s[3]}">${s[3]}</td></tr>
      <tr><td class="side cell-${s[4]}">${s[4]}</td><td class="cell-${s[5]}">${s[5]}</td><td class="cell-${s[6]}">${s[6]}</td><td class="side cell-${s[7]}">${s[7]}</td></tr>
      <tr><td class="side cell-${s[8]}">${s[8]}</td><td class="cell-${s[9]}">${s[9]}</td><td class="cell-${s[10]}">${s[10]}</td><td class="side cell-${s[11]}">${s[11]}</td></tr>
    </table>`;
}

const viewState = function(state, index) {
  return `<h1>${index}: ${state.moves}</h1>${viewConfig(state.state)}
    ${f(state.state)}
    <hr/>`;
}

const viewStates = function(states) {
  return `<section>${states.map(viewState).join('')}</section>`;
};

view(state, states);
