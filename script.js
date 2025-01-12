const search = document.querySelector('.search')
const reposList = document.querySelector('.repos-list')

const debounceFetchRepo = debounce(fetchRepo, 425)

search.addEventListener('input', function () {
    if (!search.value) return
    debounceFetchRepo(search.value)
})

search.addEventListener('click', function () {
    debounceFetchRepo(search.value)
})

function fetchRepo(repoName) {
    fetch(`https://api.github.com/search/repositories?q=${repoName}+in:name`)
        .then(response => response.json())
        .then(repos => renderResults(repos.items))
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
    console.log(repo)
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