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

			// Define the target index where conversion should occur
			const targetIndex = 2; // Example: can adjust this or use a condition to determine

			// Print each word with its corresponding index and insert the string if conditions are met
			this.printAndInsertAfter(words, targetIndex, convertedUnit);
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

/**
 * onload() { 
 * read the content of the editor
 * split the content into words
 * go through each word and iterate to see if check if the text matches the unit's regular expression
 * if it does, convert the unit
 * round the value if necessary
 * replace the text with the converted value and unit
 * }
 */