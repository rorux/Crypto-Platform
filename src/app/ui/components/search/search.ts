import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule, NzInputSearchEvent } from 'ng-zorro-antd/input';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-search',
    imports: [FormsModule, NzInputModule],
    templateUrl: './search.html',
    styleUrl: './search.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class Search implements OnInit, OnDestroy {
    public readonly placeholder = input<string>();
    public readonly searchChanged = output<string>();

    private readonly searchSubject$ = new Subject<string>();
    private readonly debounceTimeMs = 300;
    private subscription?: Subscription;

    public ngOnInit(): void {
        this.subscription = this.searchSubject$
            .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
            .subscribe((searchValue) => {
                this.searchChanged.emit(searchValue);
            });
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    protected onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value.trim();

        this.searchSubject$.next(value);
    }

    protected onSearch(event: NzInputSearchEvent): void {
        const searchValue = event.value?.trim() || '';
        this.searchChanged.emit(searchValue);
    }
}
