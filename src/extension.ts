import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorld" is now active!'
  );

  let wordCounter = new WordCounter();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "mobtimer.helloWorld",
    () => {
		wordCounter.updateWordCount();	
		console.log("Hello World from mobtimer-vscode!!");	
		//window.showInformationMessage("Hello World from mobtimer-vscode!!");
    }
  );

  context.subscriptions.push(wordCounter);
  context.subscriptions.push(disposable);
}

export function deactivate() {}

class WordCounter {

    private _statusBarItem: StatusBarItem;

	public constructor() {
		this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left); 
	}

    public updateWordCount() {

        // Get the current text editor 
        let editor = window.activeTextEditor; 
        if (!editor) { 
            this._statusBarItem.hide(); 
            return; 
        } 

         let doc = editor.document; 

        // Only update status if an MarkDown file 
        if (doc.languageId === "markdown") { 
            let wordCount = this._getWordCount(doc); 

            // Update the status bar 
            this._statusBarItem.text = "yadadadadyayaya"; //wordCount !== 1 ? `${wordCount} Words` : '1 Word'; 
            this._statusBarItem.show(); 
        } else { 
            this._statusBarItem.text = "(not a markdown file)"; 
            this._statusBarItem.show(); 
            // this._statusBarItem.hide(); 
        } 
    } 

    public _getWordCount(doc: TextDocument): number { 

        let docContent = doc.getText(); 

        // Parse out unwanted whitespace so the split is accurate 
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' '); 
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
        let wordCount = 0; 
        if (docContent !== "") { 
            wordCount = docContent.split(" ").length; 
        } 

        return wordCount; 
    } 

    dispose() {
        this._statusBarItem.dispose();
    }
}