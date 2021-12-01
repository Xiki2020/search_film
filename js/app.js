let usersHTML = document.querySelector(".users");
let btnShowPosts = document.querySelector(".show_posts");
let posts = document.querySelector(".posts");
let Users = [];

function sendRequest(url, func) {
    fetch(url)
        .then(response => response.json())
        .then(body => func(body));
}

function getUsers(obj) {
    obj.forEach(elem => {
        Users.push(elem);
        let user = document.createElement("div");
        user.classList.add("user");
        user.setAttribute("user_id", elem.id);
        let nameUser = document.createElement("h4");
        nameUser.innerHTML = elem.name;
        nameUser.setAttribute("user_id", elem.id);
        user.append(nameUser);
        usersHTML.append(user);
        user.addEventListener("click", userInfo)
    });
};
sendRequest('https://jsonplaceholder.typicode.com/users', getUsers);

function userInfo(event) {
    document.querySelector(".user_posts").hidden = true;
    document.querySelectorAll(".td_value").forEach(elem => elem.innerHTML = "");
    document.querySelector(".users_info").hidden = false;
    let userInfo = document.querySelector(".user_info");
    Users.forEach(elem => {
        if (elem.id == event.target.getAttribute("user_id")) {
            btnShowPosts.setAttribute("user_id", event.target.getAttribute("user_id"));
            for (let key in elem) {
                let text = document.createElement("p");
                text.innerHTML = elem[key];
                let div = document.querySelector(`.value_${key}`);
                if (key === "address") {
                    text.innerHTML = `${elem[key]["city"]}, ${elem[key]["street"]}`;
                    div.append(text);
                } else if (key !== "id" && key !== "company") {
                    div.append(text);
                };
            };
        };
    });
};

btnShowPosts.addEventListener("click", () => {
    let url = `https://jsonplaceholder.typicode.com/posts?userId=${btnShowPosts.getAttribute("user_id")}`;
    sendRequest(url, showPosts);
});

function showPosts(obj) {
    posts.innerHTML = "";
    document.querySelector(".user_posts").hidden = false;
    obj.forEach(elem => {
        let post = document.createElement("div");
        post.classList.add("post");
        let h4 = document.createElement("h4");
        let p = document.createElement("p");
        h4.innerHTML = elem.title;
        p.innerHTML = elem.body;
        post.append(h4, p);
        posts.append(post);
    });
}

//DZ 
let search = document.forms.search;
let films = document.querySelector(".films");
let pagination = document.querySelector(".pagination_films");
let page = 1;

search.title.addEventListener("input", () => page = 1);
search.type.addEventListener("input", () => page = 1);
document.querySelector(".btn_search").addEventListener("click", getFilms);

function showFilm(obj) {
    films.innerHTML = "";
    pagination.innerHTML = "";
    if (obj.Response == "True") {
        obj.Search.forEach(elem => {
            let film = document.createElement("div");
            film.classList.add("film");
            let poster = document.createElement("div");
            poster.classList.add("poster");
            let img = document.createElement("div");
            img.classList.add("poster_img");
            if (elem.Poster == "N/A") elem.Poster = "https://www.kinomozg.com/images/noposter.png";
            img.style.background = `url(${elem.Poster})`;
            img.style.backgroundSize = "cover";
            img.style.backgroundPosition = "center";
            let info = document.createElement("div");
            info.classList.add("info");
            let type = document.createElement("p");
            type.classList.add("type");
            type.innerHTML = elem.Type;
            let title = document.createElement("h3");
            title.innerHTML = elem.Title;
            let year = document.createElement("p");
            year.classList.add("year_film");
            year.innerHTML = elem.Year;
            let btn = document.createElement("button");
            btn.classList.add("details_film");
            btn.setAttribute("IdFilm", elem.imdbID);
            btn.innerHTML = "Details";

            poster.append(img, btn);
            info.append(type, title, year);
            film.append(poster, info);
            films.append(film);
        });
        editPagination(obj.totalResults);
        getDetailsFilm();
    }
    else {
        let attention = document.createElement("h3");
        attention.innerHTML = "Movie not found";
        films.append(attention);
    }
};


function getFilms(page = 1) {
    const queryParams = {
        apiKey: "e5d789fc",
        s: search.title.value,
        type: search.type.value,
        page: page
    };
    let url = "http://www.omdbapi.com/?" + new URLSearchParams(queryParams);
    sendRequest(url, showFilm);
};

function editPagination(count) {
    let pages = Math.ceil(count / 10);
    page = +page;

    if (page < 5) {
        let temp = 5;
        if (pages < 5) temp = pages;
        for (let i = 1; i <= temp; i++) {
            let btnPag = document.createElement("button");
            if (i == page) btnPag.style.backgroundColor = "lightcoral";
            btnPag.innerHTML = i;
            btnPag.classList.add("btn_pag");
            pagination.append(btnPag);
        };
    }
    else if (pages > page + 1) {
        for (let i = page + 2; i >= page - 2; i--) {
            let btnPag = document.createElement("button");
            if (i == page) btnPag.style.backgroundColor = "lightcoral";
            btnPag.innerHTML = i;
            btnPag.classList.add("btn_pag");
            pagination.prepend(btnPag);
        };
    }
    else {
        for (let i = pages; i > pages - 5; i--) {
            let btnPag = document.createElement("button");
            if (i == page) btnPag.style.backgroundColor = "lightcoral";
            btnPag.innerHTML = i;
            btnPag.classList.add("btn_pag");
            pagination.prepend(btnPag);
        };
    };

    let btnPrevPag = document.createElement("button");
    btnPrevPag.innerHTML = "<<";
    pagination.prepend(btnPrevPag);

    if (page == 1) btnPrevPag.disabled = true;

    let btnNextPag = document.createElement("button");
    btnNextPag.innerHTML = ">>";
    pagination.append(btnNextPag);

    if (page == Math.ceil(count / 10)) btnNextPag.disabled = true;

    btnPrevPag.addEventListener("click", () => getFilms(--page));
    btnNextPag.addEventListener("click", () => getFilms(++page));

    document.querySelectorAll(".btn_pag").forEach(element => {
        element.addEventListener("click", () => {
            page = element.innerHTML;
            getFilms(page);
        });
    });
};

function getDetailsFilm() {
    let btnsFilm = document.querySelectorAll(".details_film");
    btnsFilm.forEach(elem => {
        elem.addEventListener("click", (event) => {
            const queryParams = {
                apiKey: "e5d789fc",
                i: event.target.getAttribute("IdFilm"),
            };
            let url = "http://www.omdbapi.com/?" + new URLSearchParams(queryParams);
            sendRequest(url, showDetailsFilm);
        });
    });
};

function showDetailsFilm(obj) {
    if (document.querySelector(".window")) document.querySelector(".window").remove();
    let window = document.createElement("div");
    window.classList.add("window");
    window.style.width = "100vw";
    window.style.height = "100vh";
    window.style.position = "fixed";
    window.style.left = "0";
    window.style.top = "0";
    window.style.zIndex = "1000";
    window.style.backgroundColor = "rgba(128, 128, 128, 0.664)";
    window.style.display = "flex";
    window.style.justifyContent = "center";
    window.style.alignItems = "center";
    let innerWindow = document.createElement("div");
    innerWindow.style.width = "80%";
    innerWindow.style.height = "600px";
    innerWindow.style.backgroundColor = "#fff";
    innerWindow.style.margin = "20px";
    innerWindow.style.display = "flex";
    innerWindow.style.alignItems = "center";
    innerWindow.style.justifyContent = "space-around";
    innerWindow.style.position = "relative";
    innerWindow.style.padding = "50px 20px"

    let poster = document.createElement("div");
    poster.style.width = "30%";
    poster.style.height = "100%";
    poster.style.background = `url(${obj.Poster})`;
    poster.style.backgroundSize = "cover";
    poster.style.backgroundPosition = "center";

    let temp = ["Title", "Released", "Genre", "Country", "Director", "Writer", "Actors", "Awards"];

    let info = document.createElement("div");
    info.classList.add("info_film");
    info.style.width = "60%";
    info.style.height = "100%";
    info.style.display = "flex";
    info.style.justifyContent = "space-between";
    info.style.flexWrap = "wrap";

    temp.forEach(elem => {
        let head = document.createElement("h4");
        head.innerHTML = `${elem}:`;
        head.style.width = "30%";
        head.style.margin = "0 0 10px";
        let value = document.createElement("h4");
        value.innerHTML = obj[elem];
        value.style.width = "70%";
        value.style.margin = "0 0 10px";
        info.append(head, value);
    });

    let close = document.createElement("button");
    close.innerHTML = "X";
    close.style.position = "absolute";
    close.style.right = "10px";
    close.style.top = "10px";

    close.addEventListener("click", () => window.remove());



    innerWindow.append(poster, info, close);
    window.append(innerWindow);
    document.body.prepend(window);
};

sendRequest("https://jsfiddle.net/jq46hpwc/echo/", showJSON);

function showJSON(obj) {
    console.log(obj);
}