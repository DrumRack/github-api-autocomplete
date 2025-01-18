const search = document.querySelector('.search')
const reposList = document.querySelector('.repos-list')

const debounceFetchRepo = debounce(fetchRepo, 425)

search.addEventListener('input', function () {
    debounceFetchRepo(search.value)
})

function fetchRepo(repoName) {
    if (!repoName) return renderResults([])
    fetch(`https://api.github.com/search/repositories?q=${repoName}+in:name`)
        .then(response => response.json())
        .then(repos => {
            const favReposId = Array.from(reposList.children).map(item => item.repoId)
            const filtredRepos = repos.items.filter(item => {
                for (repoId of favReposId) if (item.id === repoId) return
                return item
            })
            return renderResults(filtredRepos)
        })
}

function renderResults(repos) {
    repos.length = 5
    if (document.querySelector('.result-list')) document.querySelector('.result-list').remove()
    const resultList = document.createElement('ul')
    resultList.className = 'result-list'

    for (const repo of repos) {
        if (repo === undefined) break
        const resultItem = document.createElement('li')
        resultItem.className = 'result-item'
        resultItem.textContent = repo.name
        
        resultItem.repoId = repo.id
        resultItem.owner = repo.owner.login
        resultItem.stars = repo.stargazers_count

        resultList.insertAdjacentElement('afterbegin', resultItem)
    }

    resultList.addEventListener('click', function (event) {
        addToFavoriteRepo(event.target)
    })
    search.after(resultList)
}

function addToFavoriteRepo(repo) {
    const img = document.createElement('img')
    img.className = 'close-btn'
    img.src = 'img/close.svg'
    img.alt = ''

    repo.className = 'favorite-repo'
    repo.innerHTML = `Name: ${repo.textContent}<br>Owner: ${repo.owner}<br>Stars: ${repo.stars}`

    repo.insertAdjacentElement('beforeend', img)
    reposList.insertAdjacentElement('beforeend', repo)

    img.addEventListener('click', function () {
        repo.remove()
    })
}

function debounce(fn, debounceTime) {
    let timerId
    return function (...args) {
        if (timerId) clearTimeout(timerId)
        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime)
    }
}