const defaultState = {
  "name": "",
  "nationality": "",
  "gender": "",
  "life": 0.0,
  "fishing": 0.0,
  "strength": 0.0,
  "health": 10.0,
  "maxHealth": 10.0,
  "wealth": 0.0,
  "intelligence": 0.0,
  "charisma": 0.0,
  "hunger": 5.0,
  "maxHunger": 10.0,
  "hydration": 5.0,
  "maxHydration": 10.0,
  "hygiene": 10.0,
  "maxHygiene": 10.0,
  "happiness": 10.0,
  "maxHappiness": 10.0,
  "energy": 10.0,
  "maxEnergy": 10.0,
  "poop": 0.0,
}

let totals = {
  "eaten": 0.0
}

let currentlyFishing = false

let currentState = Object.assign({}, defaultState);

const log = (text) => {
  const newLine = document.createElement("li");
  newLine.innerHTML = text;
  document.getElementById("console").appendChild(newLine);
  const scroll = document.getElementsByClassName("console")[0];
  scroll.scrollTop = scroll.scrollHeight;
}

const updateStatsUI = () => {
  for (var key in currentState) {
    if (currentState.hasOwnProperty(key)) {
        element = document.getElementById(key)
        if (key === "poop") {
          if (currentState.poop > 0){
            element.innerHTML = "💩".concat(" ").repeat(currentState[key])
            element.style.display = "inline"
          } else {
            element.style.display = "none"
          }
          
        } else {
          element.innerHTML = currentState[key]
        }
    }
  }
}

const death = () => {
  endTimestamp = new Date()
  finalScore = (endTimestamp - startTimestamp) / 1000
  const sprite = document.getElementById("sprite")
  sprite.innerHTML = "💀 You died!"
  clearInterval(mainLoop)
  const topRow = document.getElementById("topRow")
  const bottomRow = document.getElementById("bottomRow")
  const poopRow = document.getElementById("poop")
  poopRow.style.display = "none"
  topRow.style.display = "none"
  bottomRow.style.display = "none"
  log("you died!")
  log(`your score: ${finalScore}`)
}

const change = (element, increase) => {
  if (increase){
    element.style.color = "#00CC00";
  } else {
    element.style.color = "#CC0000";
  }
}

const fadeIn = (element) => {
	element.style.color = "#666666";
}

const removeElement = (element) => {
  element.parentNode.removeChild(element);
}

const updateStat = (stat, value) => {
  let element = document.getElementById(stat);
  let maxStr = "max" + stat.charAt(0).toUpperCase() + stat.slice(1)
  let increase
  if (maxStr in currentState) {
    if (currentState[stat] + value <= currentState[maxStr] && currentState[stat] + value >= 0) {
      currentState[stat] += value
    }
    if (currentState[stat] + value < 0) {
      currentState.health -= 1
      log(`your ${stat} is too low! ❤️ health -1.`)
    }
  } else {
    currentState[stat] += value
  }
  if (value > 0) {
    // increase
    increase = true
    change(element, increase);
    setTimeout(() => {fadeIn(element)}, 2000);
  }
  else {
    // decrease
    increase = false
    change(element, increase);
    setTimeout(() => {fadeIn(element)}, 2000);
  }
  updateStatsUI()
  if (currentState.health === 0) {
    death()
  }
}

const fish = () => {
  if (!currentlyFishing) {
    currentlyFishing = true
    log("You start fishing 🎣 ...")
    setTimeout(() => {
      num = Math.round((Math.random() * 1) + 0)
      console.log(num)
      if (num == 1) {
        log("you caught a fish! 🐟")
        updateStat("fishing", 1.0)
        log("🎣 fishing level +1.")
      } else {
        log("nothing biting. 🥾")
      }
      currentlyFishing = false
    }, 2000)
  }
}

const doAction = (event) => {
  let action
  if (event instanceof Event) {
    action = event.target.id
  } else {
    action = event
  }
  switch (action) {
    case "eat":
      log("you eat 🥖. hunger +1")
      if (currentState.hunger < currentState.maxHunger) {totals.eaten += 1}
      updateStat("hunger", 1.0)
      break
    case "drink":
      log("you drink 🥛. hydration +1")
      updateStat("hydration", 1.0)
      break
    case "clean":
      log("you clean 🧼. hygiene +1. energy -1.")
      updateStat("hygiene", 1.0)
      updateStat("energy", -1.0)
      updateStat("poop", -1.0)
      break
    case "play":
      log("you play ⚽. happiness +1. energy -1")
      updateStat("happiness", 1.0)
      updateStat("energy", -1.0)
      break
    case "sleep":
      log("you sleep 🛏️. energy +1. hunger -1. hydration -1.")
      updateStat("energy", 1.0)
      updateStat("hunger", -1.0)
      updateStat("hydration", -1.0)
      break
    case "poop":
      log("you poop 💩. hygiene -1. happiness -1.")
      updateStat("poop", 1.0)
      updateStat("hygiene", -1.0)
      updateStat("happiness", -1.0)
      break
    case "fish":
      fish()
      break
  }
}

const getName = async () => {
  const response = await fetch('https://uinames.com/api/?amount=1&maxlen=12')
  const resJson = await response.json()
  currentState.name = resJson.name
  currentState.nationality = resJson.region
  currentState.gender = resJson.gender.charAt(0).toUpperCase() + resJson.gender.slice(1)
  updateStatsUI()
}

const startNewLife = () => {
  const middleRow = document.getElementById("middleRow")
  const actionBtns = document.getElementsByClassName("actionButton")
  const stats = document.getElementsByClassName("stat")
  getName()
  for (let i = 0; i < actionBtns.length; i++) {
    actionBtns[i].addEventListener("click", doAction)
    actionBtns[i].style.display = "inline"
  }
  for (let i = 0; i < stats.length; i++) {
    stats[i].style.display = "inline"
  }
  
  const sprite = document.createElement("p")
  const poop = document.createElement("p")
  poop.innerHTML = "💩"
  poop.id = "poop"
  sprite.innerHTML = "👶"
  sprite.setAttribute("id", "sprite")
  middleRow.appendChild(sprite)
  middleRow.appendChild(poop)
  updateStatsUI()
  btnStartNewLife.style.opacity = 0
  removeElement(btnStartNewLife)

  log("new life started.")
  updateStat("life", 1.0)
  log("😃 life level +1.")
  startTimestamp = new Date()
  mainLoop = setInterval(tick, 1000)
}

const levelUp = (newLevel) => {
  log("--------level up!--------")
  updateStat("life", 1.0)
  updateStat("intelligence", 1.0)
  updateStat("charisma", 1.0)
  updateStat("strength", 1.0)
  log("😃 life level +1.")
  log("📚 intelligence +1.")
  log("🕶️ charisma +1.")
  log("💪 strength +1.")
  switch (newLevel) {
    case 5:
      updateStat("fishing", 1.0)
      log("🎣 fishing level +1")
      const sprite = document.getElementById("sprite")
      if (currentState.gender == "Male") {
        sprite.innerHTML = "👦"
      } else {
        sprite.innerHTML = "👧"
      }
      const topRow = document.getElementById("topRow")
      let fishingBtn = document.createElement("a")
      fishingBtn.className = "actionButton"
      fishingBtn.id = "fish"
      fishingBtn.innerHTML = "🎣 Fish"
      fishingBtn.style.display = "inline"
      fishingBtn.addEventListener("click", doAction)
      topRow.appendChild(fishingBtn)
      break
  }
  log("-------------------------")
}

const tick = () => {
  num = Math.floor((Math.random() * 1000) + 1)
  switch(currentState.life) {
    case 1:
      if (num > 900) {
        doAction("poop")
      }
      break
    case 2:
      if (num > 950) {
        doAction("poop")
      }
      break
    case 3:
      if (num > 970) {
        doAction("poop")
      }
      break
    case 4:
      if (num > 990) {
        doAction("poop")
      }
      break
  }

  if (totals.eaten >= 20 && currentState.life == 1) {
    levelUp(2)
  } else if (totals.eaten >= 40 && currentState.life == 2) {
    levelUp(3)
  } else if (totals.eaten >= 80 && currentState.life == 3) {
    levelUp(4)
  } else if (totals.eaten >= 160 && currentState.life == 4) {
    levelUp(5)
  }
}

let mainLoop
let startTimestamp
const btnStartNewLife = document.getElementById("btnStart");
btnStartNewLife.addEventListener("click", startNewLife);
log("welcome!")


