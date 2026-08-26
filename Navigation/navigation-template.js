/* A navigation.html tartalma ide van atmasolva, sablon-stringkent.

mivel a a live-server csomag (127.0.0.1:5501) automatikusan egy <script>-et fuz be minden
text/html valaszba - beleertve azt is, amit a lapok ajax-szal (jQuery .load())
toltenek be a navigation.html-bol

ez a befuzes a navigation.html kozepen,
a theme-switch gomb inline svg-i kozott csusztatta be magat, es a valasz
emiatt csonkolva erkezett vissza: a <div id="cart-drawer"> resz (es minden
utana kovetkezo) sosem kerult be a dom-ba
ezert nem nyilt ki a kosar oldalsav, amikor a backend (tobb parhuzamos kerest okozva) is futott.

sima .js fajlkent viszont a szerver nem nyul hozza a tartalomhoz, igy ez a hiba szervertol fuggetlenul nem biztos, hogy visszajon

ha a navigaciot modositod, ITT tedd - a navigation.html mar csak
referenciakent van megtartva, a lapok ezt a valtozot hasznaljak. */

window.NAVIGATION_HTML = `
<nav>

    <input type="checkbox" id="check">

    <label for="check" class="check_button" onclick="toggleMenu()" title="Menü">
        <ion-icon name="menu" id="menuIcon"></ion-icon>
        <ion-icon name="close" id="closeIcon" style="display: none;"></ion-icon>
    </label>

    <label class="logo">
        <ion-icon name="color-palette-outline" class="fenti-logokep"></ion-icon>
        <a href="../Main/index.html">Festményvilág</a>
    </label>

    <ul>
        <li><a href="../Products/termekek.html" data-test-id="nav-products">Termékek</a></li>
        <li><a href="../Blog/cikkek.html">Magazin</a></li>
        <li><a href="../AboutUs/rolunk.html" data-test-id="nav-about-us" >Rólunk</a></li>
    </ul>

    <!-- modositottam, hogy a login esa  basket mindig navbaron maradjon -->
    <div class="nav-actions">

        <!-- Kijelentkezve: bejelentkezes popup. Belepve: fiok menu.
             A valtast a Navigation/auth.js intezi (.is-authed osztaly). -->
        <div class="user-menu" id="user-menu">

            <a id="btnLogin" class="btnLogin-popup" title="Bejelentkezés" data-test-id="login-open">
                <ion-icon class="nav_icon" name="person-outline"></ion-icon>
            </a>

            <div class="user-menu__dropdown" id="user-dropdown">
                <div class="user-menu__head">
                    <span class="user-menu__label">Bejelentkezve</span>
                    <span class="user-menu__name" id="user-menu-name"></span>
                </div>
                <a href="../Account/profilom.html">Profilom</a>
                <a href="../Account/termekeim.html">Termékeim</a>
                <a href="../ProductsUpload/termek-feltoltese.html">Termék feltöltése</a>
                <a href="../Order/egyedi-rendeles.html">Egyedi rendelés</a>
                <a href="../Admin/admin.html" id="owner-link" hidden>Owner felület</a>
                <button type="button" id="logout-btn">Kilépés</button>
            </div>

        </div>

        <a id="fentikosar" title="Kosár">
            <ion-icon class="nav_icon" name="cart-outline"></ion-icon>
            <span class="cart-count" id="cart-count" hidden>0</span>
        </a>

      <button id="theme-switch">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
      </button>
    </div>

</nav>

<!-- Bejelentkezés / regisztráció -->
<div id="popup" class="popup-container" data-test-id="login-modal">
    <div class="popup-content">

        <span id="btnClose" class="popup-close" title="Bezárás" data-test-id="login-close"><ion-icon name="close"></ion-icon></span>

        <div class="form-box login">
            <h2>Bejelentkezés</h2>
            <form action="#" onsubmit="return false">
                <div class="input-box">
                    <label for="user-login">Felhasználónév</label>
                    <input type="text" id="user-login" required>
                </div>
                <div class="input-box">
                    <label for="pass-login">Jelszó</label>
                    <input type="password" id="pass-login" required>
                </div>
                <div class="remember-forgot">
                    <label><input type="checkbox">Emlékezz rám</label>
                    <a href="#">Elfelejtettem a jelszavam</a>
                </div>
                <button type="submit" class="btn btn--block" id="login-btn" data-test-id="login-submit-button">Bejelentkezés</button>
                <div class="login-register">
                    <p>Nincs még fiókod? <a href="#" class="register-link">Regisztráció</a></p>
                </div>
            </form>
        </div>

        <div class="form-box register">
            <h2>Regisztráció</h2>
            <form action="#" onsubmit="return false">
                <div class="input-box">
                    <label for="user-reg">Felhasználónév</label>
                    <input id="user-reg" type="text" required>
                </div>
                <div class="input-box">
                    <label for="email">Email</label>
                    <input id="email" type="email" required>
                </div>
                <div class="input-box">
                    <label for="pass-reg">Jelszó</label>
                    <input id="pass-reg" type="password" required>
                </div>
                <div class="remember-forgot">
                    <label><input type="checkbox">Elfogadom a felhasználói feltételeket</label>
                </div>
                <button id="regButton" type="submit" class="btn btn--block">Regisztráció</button>
                <div class="login-register">
                    <p>Van már fiókod? <a href="#" class="login-link">Bejelentkezés</a></p>
                </div>
            </form>
        </div>

    </div>
</div>

<!-- modositottam, hogy a basket jobbrol bukkanjon elo, ne pedig popupban -->
<div id="cart-drawer" class="drawer">

    <div class="drawer__backdrop" data-cart-close></div>

    <aside class="drawer__panel" role="dialog" aria-label="Kosár">

        <header class="drawer__head">
            <h2>Kosár</h2>
            <button type="button" class="drawer__close" data-cart-close title="Bezárás">
                <ion-icon name="close"></ion-icon>
            </button>
        </header>

        <div id="cartItems" class="drawer__body"></div>

        <footer class="drawer__foot" id="cart-foot" hidden>
            <div class="drawer__total">
                <span>Összesen</span>
                <strong id="cart-total">0 Ft</strong>
            </div>
            <button type="button" class="btn btn--block" id="cart-checkout">Tovább a fizetéshez</button>
        </footer>

    </aside>
</div>
`;

function toggleMenu() {
    var menuIcon = document.getElementById("menuIcon");
    var closeIcon = document.getElementById("closeIcon");
    var open = menuIcon.style.display !== "none";

    menuIcon.style.display = open ? "none" : "block";
    closeIcon.style.display = open ? "block" : "none";
}
