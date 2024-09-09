import { Plugin } from "obsidian";
import { unitsCheckForConversion } from "./src/conversions";

export default class MyPlugin extends Plugin {

	onload() {
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			const updatedContent = this.processContent(content);
			
			if (updatedContent !== content) {
				// Update the editor with the new content if changes were made
				editor.getDoc().setValue(updatedContent);
			} 
		});
	}

	// Main processing function to handle unit conversion
	processContent(content: string): string {
		const words = this.splitTextBySpace(content);
		this.printWordsWithIndices(words);

		const targetIndex = 2;
		const convertedUnit = "This is the converted unit string.";
		this.printAndInsertAfter(words, targetIndex, convertedUnit);

		// Convert units if necessary and return updated content
		return this.convertUnitsIfNecessary(content);
	}

	// Function to split text by spaces
	splitTextBySpace(text: string): string[] {
		return text.split(' ');
	}

	// Function to print words with their indices
	printWordsWithIndices(words: string[]) {
		words.forEach((word, index) => {
			console.log(`Index: ${index}, Word: "${word}"`);
		});
	}

	// Function to print words and insert a string if the index matches a specific value
	printAndInsertAfter(words: string[], targetIndex: number, insertString: string) {
		words.forEach((word, index) => {
			console.log(`Index: ${index}, Word: "${word}"`);
			if (index === targetIndex) {
				console.log(`( ${insertString} )`);
			}
		});
	}

	// Function to convert units if not already converted
	convertUnitsIfNecessary(content: string): string {
		let updatedContent = content;
	
		// Iterate over each conversion pattern
		unitsCheckForConversion.forEach(({ regex, unit: conversionFunction }) => {
			const matches = this.findMatches(content, regex);
	
			if (matches) {
				matches.forEach(match => {
					if (!this.unitAlreadyConverted(content, match)) {
						const convertedValue = typeof conversionFunction === 'function' ? (conversionFunction as (match: string) => string)(match) : '';
						updatedContent = this.insertConvertedValue(updatedContent, match, convertedValue);
						console.log(`Converted "${match}" to "${convertedValue}"`);
					}
				});
			}
		});
	
		return updatedContent;
	}

	// Function to find matches based on regex
	findMatches(content: string, regex: RegExp): string[] | null {
		return content.match(regex);
	}

	// Function to check if the unit has already been converted
	unitAlreadyConverted(content: string, match: string): boolean {
		const regex = new RegExp(`${match}\\s*\\(\\s*\\d+(\\.\\d+)?\\s*\\)`);
		return regex.test(content);
	}

	// Function to insert the converted value into the content
	insertConvertedValue(content: string, match: string, convertedValue: string): string {
		return content.replace(match, `${match} (${convertedValue})`);
	}
}
