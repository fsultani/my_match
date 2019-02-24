import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import welcome from './views/welcome.js';
import loginPage from './views/login.js';

const Router = () => {
  axios.defaults.headers.common['authorization'] = Cookies.get('token')
  let { pathname, hash } = window.location;

  const loginScript = document.createElement('script');
  loginScript.src = 'javascripts/scripts/Login.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = 'javascripts/scripts/Logout.js';
  document.head.appendChild(logoutScript);
  if (Cookies.get('token')) {
    layout() + welcome();
  } else {
    window.history.pushState(null, null, '/login');
    document.getElementById('app').innerHTML = layout() + loginPage();
  }

  window.addEventListener('popstate', (e) => {
    switch (window.location.pathname) {
      case '/':
        layout() + welcome();
        // document.getElementById('app').innerHTML = layout() + welcome();
        break;
      case '/login':
        // layout() + welcome();
        // document.getElementById('app').innerHTML = layout() + loginPage();
        break;
      case '/register':
        // document.getElementById('app').innerHTML = layout() + personalInfo;
        break;
      case '/home':
        // document.getElementById('app').innerHTML = layout() + welcome();
        break;
      default:
        break;
    }
  })

  window.addEventListener('hashchange', () => {
    switch (window.location.hash) {
      case '#home':
        window.history.replaceState(null, null, '/');
        layout() + welcome();
        break;
      case '#login':
        window.history.replaceState(null, null, '/login');
        document.getElementById('app').innerHTML = layout() + loginPage();
        break;
      case '#register':
        window.history.replaceState(null, null, '/register');
        document.getElementById('app').innerHTML = layout() + personalInfo;
        break;
      default:
        break;
    }
  })
}

export default Router;
