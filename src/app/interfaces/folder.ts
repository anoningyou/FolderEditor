import { IFileSystemNode } from "./file-system-node";
import { IFile } from "./file";

export interface IFolder extends IFileSystemNode  {
  children: IFolder[];
  files: IFile[];
}
