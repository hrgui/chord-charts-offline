import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "app/session/LoginPage";
import { LogoutPage } from "app/session/LogoutPage";
import { ProtectedRoute } from "lib/router/ProtectedRoute";
import SongsListPage from "app/songs/SongsListPage";
import SetlistsListPage from "app/setlists/SetlistsListPage";
import SongViewPage from "app/songs/SongViewPage";
import SongFormPage from "app/songs/form/SongFormPage";

export function AppRootRoutes() {
  return (
    <Switch>
      <Route component={LoginPage} path="/login" exact />
      <ProtectedRoute component={LogoutPage} path="/logout" exact />

      <ProtectedRoute component={SongsListPage} path="/songs" exact />
      <ProtectedRoute component={SongViewPage} path="/song/:id/view" exact />
      <ProtectedRoute component={SetlistsListPage} path="/setlists" exact />
      <ProtectedRoute exact component={SongFormPage} path="/song/new" />
      <ProtectedRoute exact component={SongFormPage} path="/song/:id/edit" />
      <Redirect from="/" to="/songs" />
    </Switch>
  );
}

export default AppRootRoutes;
