import {
  Component,
  computed,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FoldersTreeComponent } from '../folders-tree/folders-tree.component';
import { FolderEditFormComponent } from '../folder-edit-form/folder-edit-form.component';
import { MatCardModule } from '@angular/material/card';
import { NestedTreeNode } from '../../models/nested-tree-node';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NodeTypes } from '../../../enums/node-types';
import { IconsEnum } from '../../../enums/icons-enum';
import { IFolder } from '../../../interfaces/folder';
import { IFile } from '../../../interfaces/file';

@Component({
  selector: 'app-folder-editor',
  standalone: true,
  imports: [
    FoldersTreeComponent,
    FolderEditFormComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './folder-editor.component.html',
  styleUrl: './folder-editor.component.scss',
})
export class FolderEditorComponent {

  //#region Public properties

  public currentNode: WritableSignal<NestedTreeNode | null> = signal(null);

  public isCurrentNodeFolder: Signal<boolean> = computed(
    () => this.currentNode()?.type === NodeTypes.folder
  );

  //#endregion Public properties

  //#region Public methods

  public onItemSelected(node: NestedTreeNode | null): void {
    this.currentNode.set(node);
  }

  public onAddFolders(count: number = 1): void {
    const currentNode = this.currentNode();
    if (count > 0 && !!currentNode && currentNode.type === NodeTypes.folder) {
      const newFolders = Array.from(
        { length: count },
        () =>
          new NestedTreeNode({
            name: `Folder_${crypto
              .getRandomValues(new Uint32Array(1))[0]
              .toString(16)}`,
            icon: IconsEnum.folder,
            files: [],
            children: [],
          } as IFolder)
      );
      currentNode.addChildren(newFolders);
    }
  }

  public onAddFiles(count: number = 1): void {
    const currentNode = this.currentNode();
    if (count > 0 && !!currentNode && currentNode.type === NodeTypes.folder) {
      const newFolders = Array.from(
        { length: count },
        () =>
          new NestedTreeNode({
            name: `File_${crypto
              .getRandomValues(new Uint32Array(1))[0]
              .toString(16)}.txt`,
            icon: IconsEnum.file,
          } as IFile)
      );
      currentNode.addChildren(newFolders);
    }
  }

  //#endregion Public methods

}
