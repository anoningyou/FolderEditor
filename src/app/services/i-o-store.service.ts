import { Injectable } from '@angular/core';
import { IFolder } from '../interfaces/folder';
import { IconsEnum } from '../enums/icons-enum';
import { IFile } from '../interfaces/file';

@Injectable({
  providedIn: 'root',
})
export class IOStoreService {

  //#region Private properties

  private _folders: IFolder[] = [
    {
      name: 'root',
      icon: IconsEnum.folder,
      files: [] as IFile[],
      children: [
        {
          name: 'Apple',
          icon: IconsEnum.folder,
          files: [
            {
              name: 'Apple.txt',
              icon: IconsEnum.file,
            } as IFile,
            {
              name: 'Apple2.txt',
              icon: IconsEnum.file,
            } as IFile,
          ] as IFile[],
          children: [] as IFolder[],
        } as IFolder,
        {
          name: 'Windows',
          icon: IconsEnum.folder,
          files: [] as IFile[],
          children: [] as IFolder[],
        } as IFolder,
      ],
    },
  ];

  //#endregion Private properties

  //#region Public methods

  public getFolders(): IFolder[] {
    return this._folders;
  }

  //#endregion Public methods

}
