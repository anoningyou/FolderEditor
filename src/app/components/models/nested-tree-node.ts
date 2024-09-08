import { Signal, signal, WritableSignal } from "@angular/core";
import { IFolder } from "../../interfaces/folder";
import { NodeTypes } from "../../enums/node-types";
import { BehaviorSubject, Observable } from "rxjs";
import { IFile } from "../../interfaces/file";
import { IconsEnum } from "../../enums/icons-enum";


export class NestedTreeNode {

  //#region Private properties

  private _data: IFolder | IFile;

  private _type: NodeTypes = NodeTypes.file;

  private _children: BehaviorSubject<NestedTreeNode[]> = new BehaviorSubject<NestedTreeNode[]>([]);

  private _name: WritableSignal<string> = signal('');

  private _icon: WritableSignal<IconsEnum> = signal(IconsEnum.file);

  //#endregion Private properties

  //#region Public properties

  public children$: Observable<NestedTreeNode[]> = this._children.asObservable();

  public name: Signal<string> = this._name.asReadonly();

  public icon: Signal<IconsEnum> = this._icon.asReadonly();

  public get data(): IFolder | IFile {
    return this._data;
  }

  public get type(): NodeTypes {
    return this._type;
  };

  public onDragDragOver: WritableSignal<boolean> = signal(false);

  //#endregion Public properties

  //#region Constructor

  constructor(data: IFolder | IFile, public parent: NestedTreeNode | null = null) {
    this._data = data;
    this._icon.set(data.icon);
    this._name.set(data.name);

    if ((data as IFolder).children !== undefined) {
      this._type = NodeTypes.folder;
      this.setChildren();
    }
  }

  //#endregion Constructor

  //#region Public methods

  public setName(value: string) {
    this._name.set(value);
    this.data.name = value;
  }

  public setIcon(value: IconsEnum) {
    this._icon.set(value);
    this.data.icon = value;
  }

  public addChildren(nodes: NestedTreeNode[]): void {
    if(this._type === NodeTypes.folder) {
      nodes.forEach(n => {
        if(n.parent !== null) {
          n.parent.removeChild(n);
        }

        n.parent = this;
      });

      this._children.next(this.orderNodes([...this._children.value, ...nodes]));

      (this.data as IFolder).children
        .push(...nodes.filter(n => n.type === NodeTypes.folder).map(n => n.data as IFolder));

      (this.data as IFolder).files
        .push(...nodes.filter(n => n.type === NodeTypes.file).map(n => n.data as IFile));
    }
  }

  public removeChild(node: NestedTreeNode): void {
    if(this._type === NodeTypes.folder) {
      this._children.next(this._children.value.filter(x => x !== node));
      (this.data as IFolder).children = (this.data as IFolder).children.filter(x => x !== node.data);
      (this.data as IFolder).files = (this.data as IFolder).files.filter(x => x !== node.data);
    }
  }

  public clone(): NestedTreeNode {
    return new NestedTreeNode(JSON.parse(JSON.stringify(this.data)), this.parent);
  }

  //#endregion Public methods

  //#region Private methods

  private setChildren(): void {
    this._children.next(
      this.orderNodes((this.data as IFolder).children.map(x => new NestedTreeNode(x, this)))
        .concat(this.orderNodes((this.data as IFolder).files.map(x => new NestedTreeNode(x, this))))
      );
  }

  private orderNodes(nodes: NestedTreeNode[]): NestedTreeNode[] {
    return nodes.sort((a, b) => a.type === b.type
                                ? a.name().localeCompare(b.name())
                                : a.type === NodeTypes.folder
                                          ? -1
                                          : 1
    );
  }

  //#endregion Private methods

}
