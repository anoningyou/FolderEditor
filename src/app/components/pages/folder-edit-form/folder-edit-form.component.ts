import { Component, effect, input, InputSignal, Signal } from '@angular/core';
import { NestedTreeNode } from '../../models/nested-tree-node';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { IconsEnum } from '../../../enums/icons-enum';
import { MatIcon } from '@angular/material/icon';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { StringValidators } from '../../../validators/string-validators';
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-folder-edit-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormField,
    MatSelectModule,
    MatLabel,
    MatError,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './folder-edit-form.component.html',
  styleUrl: './folder-edit-form.component.scss'
})
export class FolderEditFormComponent {

  //#region Public properties

  public currentNode: InputSignal<NestedTreeNode | null> = input<NestedTreeNode | null>(null);

  public get options(): IconsEnum[] {
    return Object.values(IconsEnum);
  }

  public readonly siblingNodeNames$: Observable<string[]> = toObservable(this.currentNode)
    .pipe(switchMap(node =>{
      if (!node || !node.parent)
        return of([]);
      return node.parent.children$
        .pipe(map(children => children
                  .filter(child => child.type === node.type && child !== node)
                  .map(child => child.name().toLowerCase())
                )
            );
    }
    ));

  public editForm = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required],
      [StringValidators.stringNotInArrayAsync(this.siblingNodeNames$)]
    ),
    icon: new FormControl(null as IconsEnum | null, [Validators.required]),
  })

  public readonly selectedIcon : Signal<IconsEnum | null | undefined> = toSignal(this.editForm.controls.icon.valueChanges);

  //#endregion Public properties

  //#region Constructor

  constructor() {
    effect(() => {
      if (this.currentNode()) {
        this.editForm.patchValue({
          name: this.currentNode()?.name(),
          icon: this.currentNode()?.icon(),
        });
      }
      else {
        this.editForm.reset();
      }

      this.editForm.markAsPristine();
    });

  }

  //#endregion Constructor

  //#region Public methods

  public onSubmit(): void {
    const node = this.currentNode();
    if (this.editForm.valid && !!node) {
      node.setName(this.editForm.controls.name.value!);
      node.setIcon(this.editForm.controls.icon.value!);
    }
  }

  public getErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }
    else if (control.hasError('stringNotInArray')) {
      return 'Name already exists';
    }

    return '';
  }

  //#endregion Public methods

}
