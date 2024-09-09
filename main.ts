import { Plugin } from "obsidian";
import units from "./units"

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
		//this.printWordsWithIndices(words);

		this.convertWords(words);

		// Convert units if necessary and return updated content
		return words.join(' ');
	}

	// Function to split text by spaces
	splitTextBySpace(text: string): string[] {
		return text.split(' ');
	}

	// Function to add converted unit words to the content
	convertWords(words: string[]) {
		for (let i = 1; i < words.length; i++) {
			const unit = words[i].toLowerCase().trim();
			const nextWord = words.length > i + 1 ? words[i + 1].toLowerCase().trim() : '';
			const rawValue = words[i - 1].trim();
			let value;

			try {
				value = parseFloat(rawValue);
			} catch (_) {
				continue;
			}

			if (!Object.keys(units).includes(unit)) {
				continue;
			}

			// @ts-ignore
			const { newUnit, ratio } = units[unit];

			const convertedValue = (value * ratio).toFixed(2);
			const convertedUnitString = `(${convertedValue}${newUnit})`;
			if(nextWord === convertedUnitString) {
				continue;
			} else if (nextWord.endsWith(`${newUnit})`)) {
				words[i + 1] = `${convertedUnitString}`;
			} else {
				words[i] = `${words[i]} ${convertedUnitString}`;
			}

		}
	}
	
	/*
	// *unction to print words with their indices
	printWordsWithIndices(words: string[]) {
		words.forEach((word, index) => {
			console.log(`Index: ${index}, Word: "${word}"`);
		});
	}
	*/
	/*
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
		*/
}
