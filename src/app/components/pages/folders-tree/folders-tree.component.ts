import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IFolder } from '../../../interfaces/folder';
import { NestedTreeControl } from '@angular/cdk/tree';
import { NodeTypes } from '../../../enums/node-types';
import { NestedTreeNode } from '../../models/nested-tree-node';
import { AsTreeNodePipe } from '../../../pipes/as-tree-node.pipe';
import { CommonModule } from '@angular/common';
import { IOStoreService } from '../../../services/i-o-store.service';
import { map, Observable } from 'rxjs';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-folders-tree',
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    AsTreeNodePipe,
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './folders-tree.component.html',
  styleUrl: './folders-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoldersTreeComponent implements OnInit {

  //#region Private properties

  private readonly _iOStore: IOStoreService = inject(IOStoreService);

  private _rootNodes: IFolder[] = [];

  //#endregion Private properties

  //#region Public properties

  public treeControl: NestedTreeControl<NestedTreeNode> =
    new NestedTreeControl<NestedTreeNode>((x) => x.children$);

  public dataSource: MatTreeNestedDataSource<NestedTreeNode> =
    new MatTreeNestedDataSource<NestedTreeNode>();

  public currentNode: WritableSignal<NestedTreeNode | null> = signal(null);

  public itemSelected = output<NestedTreeNode | null>();

  public readonly types: typeof NodeTypes = NodeTypes;

  public dragNode: NestedTreeNode | null = null;

  //#endregion Public properties

  //#region Constructor

  constructor() {
    effect(() => {
      this.itemSelected.emit(this.currentNode());
    });
  }

  //#endregion Constructor

  //#region Public methods

  public ngOnInit(): void {
    this._rootNodes = this._iOStore.getFolders();
    this.dataSource.data = this._rootNodes.map((x) => new NestedTreeNode(x));
  }

  public setCurrentNode(event: MouseEvent, node: NestedTreeNode): void {
    this.currentNode.set(node);
  }

  public hasChild(_: number, node: NestedTreeNode): Observable<boolean> {
    return (
      !!node.children$ && node.children$.pipe(map((value) => value.length > 0))
    );
  }

  public trackBy(_: number, node: NestedTreeNode): NestedTreeNode {
    return node;
  }

  public handleDragStart(event: DragEvent, node: NestedTreeNode): void {
    event.dataTransfer?.setData('nodename', node.name());
    this.dragNode = node;
    this.treeControl.collapse(node);

    if (!!event.dataTransfer) {
      event.dataTransfer.effectAllowed = !!event.ctrlKey ? 'copy' : 'move';
    }
  }

  public handleDragOver(event: DragEvent, node: NestedTreeNode): void {
    if (
      !this.dragNode ||
      node.type === NodeTypes.file ||
      this.dragNode === node ||
      this.dragNode.parent === node
    ) {
      return;
    }

    node.onDragDragOver.set(true);
    event.preventDefault();
  }

  public handleDragLeave(node: NestedTreeNode): void {
    node.onDragDragOver.set(false);
  }

  public handleDrop(event: DragEvent, node: NestedTreeNode): void {
    node.onDragDragOver.set(false);

    if (!this.dragNode) {
      return;
    }

    event.preventDefault();

    if (event.ctrlKey) {
      node.addChildren([this.dragNode.clone()]);
    } else {
      node.addChildren([this.dragNode]);
    }

    this.dragNode = null;
  }

  public handleDragEnd(event: DragEvent): void {
    this.dragNode = null;
  }

  //#endregion Public methods

}
