import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { YoutubeService } from '../youtube/youtube-service';
import { Observable } from 'rxjs/Rx';
//import 'rxjs/Rx';
import { SearchResult } from '../youtube/search-result';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  constructor(private youtube: YoutubeService, private el: ElementRef) { }

  ngOnInit() {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.emit(true))
      .map((query: string) => this.youtube.search(query))
      .switch()
      .subscribe((results: SearchResult[]) => {
        this.loading.emit(false);
        this.results.emit(results);
      }, (err) => {
        console.log(err);
        this.loading.emit(false);
      }, () => this.loading.emit(false));
  }
}