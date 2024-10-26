"use client";

import Account from "../components/Account.mjs";
import Admin from "../components/Admin.mjs";
import Event from "../components/Event.mjs";
import Home from "../components/Home.mjs";
import SignIn from "../components/SignIn/SignIn.mjs";
import SignUp from "../components/SignUp.mjs";
import SignOut from "../components/SignOut.mjs";
import Organisers from "../components/Organisers.mjs";
import Profile from "../components/Profile.mjs";
import Promotion from "../components/Promotion.mjs";
import Results from "../components/Results.mjs";
import Route from "../components/Route.mjs";
import Rules from "../components/Rules.mjs";
import styles from "../styles/page.module.css";

function App({ user, setUser, pageView, setPageView }) {
  const pageViews = [
    { view: "account", component: <Account user={user} /> },
    { view: "admin", component: <Admin user={user} /> },
    { view: "event", component: <Event user={user} /> },
    { view: "home", component: <Home user={user} /> },
    { view: "signIn", component: <SignIn user={user} setUser={setUser} setPageView={setPageView} /> },
    { view: "signUp", component: <SignUp user={user} setUser={setUser} setPageView={setPageView} /> },
    { view: "signOut", component: <SignOut user={user} /> },
    { view: "organisers", component: <Organisers user={user} /> },
    { view: "profile", component: <Profile user={user} /> },
    { view: "promotion", component: <Promotion user={user} /> },
    { view: "results", component: <Results user={user} /> },
    { view: "route", component: <Route user={user} /> },
    { view: "rules", component: <Rules user={user} /> },
  ];

  const pageComponent = pageViews.find((page) => page.view === pageView).component;

  return (
    <main data-cy="body" className={styles.main}>
      {pageComponent}
    </main>
  );
}

export default App;
