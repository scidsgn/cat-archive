type Cat = {
    id: number,
    username: string,
    catid: string,
    timestamp: number,
    catname: string,
    season: number
}

async function getSeasonCats(season: number): Promise<Cat[]> {
    let data = await fetch(
        `json/season${season}.json`
    )
    let jsonData = await data.json()

    return jsonData.map(item => { return {...item, season}})
}

async function getCats(): Promise<Cat[]> {
    let seasons = [
        getSeasonCats(1),
        getSeasonCats(2),
        getSeasonCats(3),
        getSeasonCats(4)
    ]
    let all = await Promise.all(seasons)
    let out: Cat[] = []

    all.forEach(arr => out.push(...arr))

    return out
}

function parseSearch(): Map<string, string> {
    const out = new Map<string, string>()
    const data = location.search.split("&").forEach((item, i) => {
        if (i == 0) item = item.substring(1)
        let items = item.split("=")

        out.set(items[0], items[1])
    })

    return out
}

function getEmojiPath(cat: Cat): string {
    if (cat.season == 1 && !isNaN(+cat.catid)) {
        return `emoji/season${cat.season}/cat-${cat.catid}.png`
    }

    let id = cat.catid.substring(cat.catid.length - 2)
    if (isNaN(+id)) {
        return `emoji/season${cat.season}/${cat.catid}.png`
    }
    if (/[0-9]/.test(cat.catid[cat.catid.length - 3]))
        id = cat.catid.substring(cat.catid.length - 3)

    let species = cat.catid.substring(0, cat.catid.length - id.length)

    return `emoji/season${cat.season}/${species}-${id}.png`
}

function generateCatNode(cat: Cat): HTMLDivElement {
    let div = document.createElement("div")
    div.classList.add("cat")

    div.innerHTML = `<img src="${getEmojiPath(cat)}">
    <p class="id">#${cat.id}</p>
    <p class="name">${cat.catname}</p>
    <span class="season season${cat.season}">Season ${cat.season}</span>`

    div.addEventListener("click", () => {
        let modal = document.querySelector("div.modal")

        modal.querySelector("content").className = `season${cat.season}`

        modal.querySelector("h1").textContent = cat.catname
        modal.querySelector("p.id").textContent = `#${cat.id}`
        modal.querySelector("span.season").className = `season season${cat.season}`
        modal.querySelector("span.season").textContent = `Season ${cat.season}`

        modal.querySelector("img").src = getEmojiPath(cat)

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]

        let collectionDate = new Date(+cat.timestamp * 1000)

        let hour = collectionDate.getHours()
        let ampm = hour > 11 ? "PM" : "AM"
        hour = (hour % 12)
        if (hour == 0) hour = 12

        let minutes = collectionDate.getMinutes().toString()
        if (minutes.length == 1) minutes = "0" + minutes

        let date = `${months[collectionDate.getMonth()]} ${collectionDate.getDate()} ${collectionDate.getFullYear()}, ${hour}:${minutes} ${ampm}`
        modal.querySelector("h2#catCollectionDate").textContent = date

        modal.classList.remove("hidden")
    })

    return div
}

async function generatePage() {
    let allCats = await getCats()

    let filterType: string = "season"
    let filterValue: string = "4"

    let queries = parseSearch()
    if (queries.has("filter") && queries.has("value")) {
        filterType = queries.get("filter")
        filterValue = queries.get("value")
    }

    let cats = allCats.filter(cat => cat[filterType] == filterValue).sort((c1, c2) => +c2.timestamp - +c1.timestamp)
    
    let pageTitle = `Season ${filterValue}`
    if (filterType == "username") pageTitle = "User's cats"

    document.querySelector("section.pageInfo h1").textContent = pageTitle
    document.querySelector("section.pageInfo h2").textContent = `${cats.length} cats`

    let catList = document.querySelector(".catList")
    cats.forEach(cat => {
        catList.appendChild(
            generateCatNode(cat)
        )
    })
}

generatePage()

document.querySelector("div.modal").addEventListener("click", (e) => {
    if (e.currentTarget != e.target) return
    document.querySelector("div.modal").classList.add("hidden")
})