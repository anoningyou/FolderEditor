import { IconsEnum } from "../enums/icons-enum";
import { NodeTypes } from "../enums/node-types";

export interface IFileSystemNode {
  name: string;
  icon: IconsEnum;
  //readonly type: NodeTypes;
}
