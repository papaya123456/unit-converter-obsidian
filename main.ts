import { Plugin } from "obsidian";

export default class MyPlugin extends Plugin {
	
	onload() {

		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();

			// Split the content into words
			const words = this.splitTextBySpace(content);

			// Print each word with its corresponding index
			words.forEach((word, index) => {
				console.log(`Index: ${index}, Word: "${word}"`);
			});

			// Define the string to be inserted
			const convertedUnit = "This is the converted unit string.";

			// Define the condition that triggers the insertion
			const condition = 2;

			// Print each word with its corresponding index and insert a string after the specific condition
			this.printAndInsertAfter(words, condition, convertedUnit);
		});

	}

	// Function to split text by spaces
	splitTextBySpace(text: string): string[] {
		// Split the text by spaces
		const words = text.split(' ');
	  
		// Return the array of words
		return words;
	}

	// Function to print words and insert a string if the index matches a specific value
	printAndInsertAfter(words: string[], targetIndex: number, insertString: string) {
		words.forEach((word, index) => {
			const message = `Index: ${index}, Word: "${word}"`;
			console.log(message);

			// Check if the current index matches the target index (e.g., index 2)
			if (index === targetIndex) {
				// Insert the specified string (convertedUnit) formatted as "( convertedUnit )"
				console.log(`( ${insertString} )`);
			}
		});
	}
}
