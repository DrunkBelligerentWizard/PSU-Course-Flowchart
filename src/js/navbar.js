export default function navBar(activePage) {
    let navbar= '';
    switch(activePage){
        case 1:
            navbar = `
            <div class="container-fluid">
            <ul class="navbar-nav">
              <li class="navbar-brand">Event Application</li>
              <li class="nav-item">
                <a class="nav-link active" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./status.html">Status</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./about.html">About</a>
              </li>
            </ul>
          </div>
          `
          break;

        case 2:
            navbar = `
            <div class="container-fluid">
            <ul class="navbar-nav">
              <li class="navbar-brand">Event Application</li>
              <li class="nav-item">
                <a class="nav-link" href="./">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">Status</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./about.html">About</a>
              </li>
            </ul>
          </div>
          `
          break;

        case 3:
            navbar = `<div class="container-fluid">
            <ul class="navbar-nav">
              <li class="navbar-brand">Event Application</li>
              <li class="nav-item">
                <a class="nav-link" href="./">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./status.html">Status</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">About</a>
              </li>
            </ul>
          </div>`
            break;
    }
    return navbar;
}
