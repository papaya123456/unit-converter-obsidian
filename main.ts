import {Plugin} from "obsidian";

export default class MyPlugin extends Plugin {
    
    async onload() {

		this.app.workspace.on('active-leaf-change', async () => { 
			const file = this.app.workspace.getActiveFile(); 
			if (file) { 
				const content = await this.app.vault.read(file); 
				console.log(content); 
			} 
		});


    }


}

