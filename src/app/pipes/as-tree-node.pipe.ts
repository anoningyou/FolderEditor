import { Pipe, PipeTransform } from '@angular/core';
import { NestedTreeNode } from '../components/models/nested-tree-node';


@Pipe({
  name: 'asTreeNode',
  standalone: true
})
export class AsTreeNodePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]) {
    return value as NestedTreeNode;
  }

}
