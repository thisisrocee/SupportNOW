import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from "./chat.component";
import {RouterModule, Routes} from "@angular/router";
import {ChatService} from "./chat-service.service";
import {MarkdownModule, provideMarkdown} from 'ngx-markdown';
import {ScrollToBottomDirective} from "../scroll-to-bottom.directive";

const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: ':id', component: ChatComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes), RouterModule],
  exports: [RouterModule, MarkdownModule],
  providers: [ChatService, provideMarkdown()]
})
export class ChatModule { }
