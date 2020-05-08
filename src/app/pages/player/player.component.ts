import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  test = "testing"
  constructor() { }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'render-messages',
  templateUrl: './render-messages.html'
})
export class renderMessageList {

  @Input() test;

  ngOnInit(){
    console.log(this.test)
  }
}
