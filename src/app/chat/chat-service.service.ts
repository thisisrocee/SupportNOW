import {Injectable, ViewChild} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {ScrollToBottomDirective} from "../scroll-to-bottom.directive";

@Injectable()
export class ChatService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }


  createNewDiscussion(prompt: string, model : string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        if (user) {
          const discussionId = this.firestore.createId();
          this.firestore.doc(`users/${user.uid}/discussions/${discussionId}`).set({
            prompt: prompt,
            id: discussionId,
            date: new Date(),
            model: model
          }).then(() => {
            resolve(discussionId);
          }).catch(reject);
        } else {
          reject("User is not authenticated");
        }
      });
    });
  }

  getLatestDiscussions(): Observable<any[]> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          let collection = this.firestore.collection(`users/${user.uid}/discussions`, ref => ref.orderBy("date","desc"));
          let data = collection.valueChanges();

          return collection.valueChanges();
        } else {
          return []; // or throw an error/return an observable error
        }
      })
    );
  }
  getDiscussion(discussionId: string): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}/discussions/${discussionId}`).valueChanges();
        } else {
          return [];
        }
      })
    );
  }
  getMessages(discussionId: string): Observable<any[]> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/discussions/${discussionId}/messages`, ref => ref.orderBy('createTime', 'asc')).valueChanges();
        } else {
          return []; // or throw an error/return an observable error
        }
      })
    );
  }

  // Example function to add a message using the current user's ID
  async addMessage(discussionId: string, message: any, model: string, isFirstMessage: boolean): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      let messageBody = {
        createTime: new Date(),
        model: model,
        prompt: message,
      };

      let example = this.addMessagePretext(message);
      if (example) {
        await this.firestore.doc(`users/${user.uid}/discussions/${discussionId}`).update({ example: [example] });
      }

      const messageId = this.firestore.createId();
      return this.firestore.doc(`users/${user.uid}/discussions/${discussionId}/messages/${messageId}`).set(messageBody);
    } else {
      throw new Error("User is not authenticated");
    }
  }

  addMessagePretext(message: string) {
    if (message.length > 0) {
      let chartTypes = "Flowchart, Sequence Diagram, Gantt Chart, Class Diagram, State Diagram, Entity Relationship Diagram, User Journey Map, Pie Chart, Requirement Diagram, Component Diagram";
      let map = [
        {
          key: "Flowchart",
          example: "graph TD;\n    A[Christmas] -->|Get money| B(Go shopping);\n    B --> C{Let me think};\n    C -->|One| D[Laptop];\n    C -->|Two| E[iPhone];\n    C -->|Three| F[fa:fa-car Car];"
        },
        {
          key: "Pie Chart",
          example: "pie\n    title Pets adopted by volunteers\n    \"Dogs\" : 386\n    \"Cats\" : 85\n    \"Rats\" : 15"
        },
        {
          key: "Sequence Diagram",
          example: "sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->>John: Hello John, how are you?\n    loop Healthcheck\n        John->>John: Fight against hypochondria\n    end\n    Note right of John: Rational thoughts\n    John-->>Alice: Great!"
        },
        {
          key: "Gantt Chart",
          example: "gantt\n    title A Gantt Diagram\n    dateFormat YYYY-MM-DD\n    section Section\n    A task :a1, 2020-06-01, 30d\n    Another task :after a1 , 20d"
        },
        {
          key: "Class Diagram",
          example: "classDiagram\n    Class01 <|-- AveryLongClass : Cool\n    Class03 *-- Class04\n    Class05 o-- Class06\n    Class07 .. Class08\n    Class09 --> C2 : Where am i?"
        },
        {
          key: "State Diagram",
          example: "stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]"
        },
        {
          key: "Entity Relationship Diagram",
          example: "erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses"
        },
        {
          key: "User Journey Map",
          example: "journey\n    title My working day\n    section Go to work\n        Make tea: 5: Me\n        Go upstairs: 3: Me\n        Do work: 1: Me, Cat\n    section Go home\n        Go downstairs: 5: Me\n        Sit down: 3: Me"
        },
        {
          key: "git graph",
          example: "gitGraph\n    commit\n    commit\n    branch newbranch\n    checkout newbranch\n    commit\n    commit\n    checkout main\n    commit\n    commit\n    merge newbranch\n    commit"
        },
        {
          key: "quadrant chart",
          example: `quadrantChart
          title Reach and engagement of campaigns
          x-axis Low Reach --> High Reach
          y-axis Low Engagement --> High Engagement
          quadrant-1 We should expand
          quadrant-2 Need to promote
          quadrant-3 Re-evaluate
          quadrant-4 May be improved
          Campaign A: [0.3, 0.6]
          Campaign B: [0.45, 0.23]
          Campaign C: [0.57, 0.69]
          Campaign D: [0.78, 0.34]
          Campaign E: [0.40, 0.34]
          Campaign F: [0.35, 0.78]`
        },
      ];
      let getFirst100Chars = message.substring(0, 100);

     let itemsMatch =  map.map((item) => {
        let regex = new RegExp(item.key, 'i');
        if (regex.test(getFirst100Chars)) {
          return item;
        }
        return null;
      }).filter((item) => item !== null);
      if (itemsMatch.length > 0) {
        return `If it is necessary to represent the message in a ${chartTypes}, please use the mermaid js.\n`+
        `${itemsMatch[0]?.key} Example(line breaks are important): \`\`\`mermaid ${itemsMatch[0]?.example}\`\`\`` ;
      }
      return ' ';
    }
    return ' ';
  }
}
