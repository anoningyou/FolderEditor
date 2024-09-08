import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "folders",
    loadComponent: () => import("./components/pages/folder-editor/folder-editor.component").then(m => m.FolderEditorComponent)
  },
  {
    path: "",
    redirectTo: "folders",
    pathMatch: "full"
  }
];
