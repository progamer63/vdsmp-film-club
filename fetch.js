async function loadTitles() {
  const response = await fetch("https://filmclub.vdsmp.com/api");
  const responseJSON = await response.json();

  const titles = [];
  for (const id in responseJSON) {
    const entry = responseJSON[id];
    const title = entry.title;
    titles.push(title);
  }

  document.querySelector("#actualTitles").innerHTML = titles.map(t => `<p>${t}</p>`).join("");
}

loadTitles();