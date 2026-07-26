let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkmode()

document.addEventListener('click', (event) => {
    const themeSwitch = event.target.closest('#theme-switch');
    if (themeSwitch) {
        darkmode = localStorage.getItem('darkmode');
        darkmode !== "active" ? enableDarkmode() : disableDarkmode();
    }
});