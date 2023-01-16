const feedDisplay = document.querySelector('#feed')

fetch('http://localhost:8000/results')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const db = data.scans;
        const keys = Object.keys(db)
        keys.forEach((key,index) => {
            const title = `<h3> ${key} - ${db[key].detected} </h3>`
            feedDisplay.insertAdjacentHTML("beforeend", title)
            })
    })
    .catch(err => console.log(err))