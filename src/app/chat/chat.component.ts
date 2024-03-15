import {Component, ElementRef, model, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "./chat-service.service";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {routes} from "../app.routes";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MarkdownComponent} from "ngx-markdown";
import {ScrollToBottomDirective} from "../scroll-to-bottom.directive";
import {ChatModule} from "./chat.module";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    JsonPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    MarkdownComponent,
    NgIf,
    ScrollToBottomDirective,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{

  @ViewChild("scroll" ,{ read: ScrollToBottomDirective }) scroll!: ScrollToBottomDirective;

  user : any | null = null
  discussionId: string | null = null;
  messages: any[] = [];
  discussions: any[] = [];
  discussion: any;
  inputText: FormControl = new FormControl('');

  model:string = "Pro";

  disableScrollDown = false
  constructor(private chatService: ChatService, private route: ActivatedRoute, private routes: Router) {
  }

  ngOnInit() {

    this.chatService.getLatestDiscussions().subscribe((discussions) => {
      this.discussions = discussions;
    });

    this.route.params.subscribe(params => {
      this.discussionId = params['id'];

       if (this.discussionId != null)
       {
          this.chatService.getDiscussion(this.discussionId).subscribe((discussion) => {
            this.discussion = discussion;
            this.model = discussion.model;
          });
          this.chatService.getMessages(this.discussionId).subscribe((messages) => {
          this.messages = messages;
          this.scroll.scrollToBottom();
        });
      }
    });
  }
  PostMessage() {
    if (this.discussionId == null)
    {
      this.chatService.createNewDiscussion(this.inputText.value, this.model).then((newId) => {
        this.discussionId = newId;

        this.chatService.addMessage(newId, this.inputText.value, this.model,true).then(() => {
          this.inputText.setValue('');
          this.routes.navigate([`/chat/${newId}`], {replaceUrl: true})
            .then();
        });

      });
  }
  else {
    this.chatService.addMessage(this.discussionId, this.inputText.value, this.model,false).then(() => {
      this.inputText.setValue('');

    });
  }
}


  protected readonly status = status;
}
