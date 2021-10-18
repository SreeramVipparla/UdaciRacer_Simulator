// Global Info
let store = {
  track_id: undefined,
  player_id: undefined,
  race_id: undefined,
};

// DOM loading wait time
document.addEventListener("DOMContentLoaded", function () {
  onPageLoad();
  setupClickHandlers();
});

async function onPageLoad() {
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt("#tracks", html);
    });

    getRacers().then((racers) => {
      const html = renderRacerCars(racers);
      renderAt("#racers", html);
    });
  } catch (error) {
    console.log("Problem getting tracks and racers ::", error.message);
    console.error(error);
  }
}

function setupClickHandlers() {
  document.addEventListener(
    "click",
    function (event) {
      let { target } = event;

      // Race track form field
      if (
        target.matches(".card.track") ||
        target.parentNode.matches(".card.track")
      ) {
        if (target.parentNode.matches(".card.track")) {
          target = target.parentNode;
        }
        handleSelectTrack(target);
      }

      // Podracer form field
      if (
        target.matches(".card.podracer") ||
        target.parentNode.matches(".card.podracer")
      ) {
        if (target.parentNode.matches(".card.podracer")) {
          target = target.parentNode;
        }
        handleSelectPodRacer(target);
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start the race
        handleCreateRace();
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        handleAccelerate(target);
      }
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}

// This async function controls the flow of the race, the logic and error handling
async function handleCreateRace() {
  const player_id = store.player_id;
  const track_id = store.track_id;

  if (!player_id || !track_id) {
    alert("Please select racer and track to start the race!");
    return;
  }

  try {
    const race = await createRace(player_id, track_id);

    store.race_id = race.ID - 1;
    renderAt("#race", renderRaceStartView(track_id));
    await runCountdown();
    await startRace(store.race_id);
    await runRace(store.race_id);
  } catch (err) {
    console.log("Problem with handleCreateRace: ", err.message);
  }
}

async function runRace(raceID) {
  const _delayTime = 1000;
  await delay(_delayTime);

  return new Promise((resolve) => {
    const intervalID = setInterval(async () => {
      const res = await getRace(raceID);

      if (res.status !== "finished") {
        renderAt("#leaderBoard", raceProgress(res.positions));
      } else {
        clearInterval(intervalID);
        resolve(res);
      }
    }, 500);
  }).catch((e) => console.log(e));
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      const timerInt = setInterval(() => {
        document.getElementById("big-numbers").innerHTML = --timer;

        if (timer === 0) {
          clearInterval(timerInt);
          resolve();
          return;
        }
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectPodRacer(target) {
  console.log("selected a pod", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  // add class selected to current target
  target.classList.add("selected");

  // save the selected racer to the store
  store.player_id = parseInt(target.id);
}

function handleSelectTrack(target) {
  console.log("selected a track", target.id);

  // remove class selected from all track options
  const selected = document.querySelector("#tracks .selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  // add class selected to current target
  target.classList.add("selected");
  // save the selected track id to the store
  store.track_id = target.id;
}
// HTML CONTROLS------------------------------------------------
function handleAccelerate(target) {
  console.log("accelerate button clicked");
  accelerate(store.race_id);
}

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
}

function renderRacerCard(racer) {
  const { id, driver_name, top_speed, acceleration, handling } = racer;

  return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`;
}

function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;

  return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track, racers) {
  return `
		<header>
			<h1>Race: ${store.track_id}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>
			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  positions.sort((a, b) => (a.final_position > b.final_position ? 1 : -1));

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
  const userPlayer = positions.find((e) => e.id == store.player_id);
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:8000";

function defaultFetchOpts() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SERVER,
    },
  };
}

function getTracks() {
  // GET request to `${SERVER}/api/tracks`
  return fetch(`${SERVER}/api/tracks`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(
        `ERROR!:Root cause-> getTracks request(line 326-330/src/client/assets/javascript/index.js)`,
        err
      )
    );
}

function getRacers() {
  // GET request to `${SERVER}/api/cars`
  return fetch(`${SERVER}/api/cars`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(
        `ERROR!:Root cause-> getRacers request(line 338-342/src/client/assets/javascript/index.js)`,
        err
      )
    );
}

function createRace(player_id, track_id) {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);
  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "jsonp",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) =>
      console.log(
        "ERROR!:Root cause-> createRace request(line 350-362/src/client/assets/javascript/index.js",
        err
      )
    );
}

function getRace(id) {
  // GET request to `${SERVER}/api/races/${id}`
  return fetch(`${SERVER}/api/races/${id}`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(
        `ERROR!:Root cause->getRace id (${id})request(line 350-362/src/client/assets/javascript/index.js`,
        err
      )
    );
}

function startRace(id) {
  return fetch(`${SERVER}/api/races/${id}/start`, {
    method: "POST",
    ...defaultFetchOpts(),
  }).catch((err) =>
    console.log(
      "ERROR!:Root cause-> startRace request(line 377-381/src/client/assets/javascript/index.js",
      err
    )
  );
}

function accelerate(id) {
  // POST request to `${SERVER}/api/races/${id}/accelerate`
  // options parameter provided as defaultFetchOpts
  // no body or datatype needed for this request
  return fetch(`${SERVER}/api/races/${id}/accelerate`, {
    method: "POST",
    ...defaultFetchOpts(),
    body: "",
  }).catch((err) =>
    console.log(
      "ERROR!:Root cause-> accelerate request(line 394-402/src/client/assets/javascript/index.js",
      err
    )
  );
}
