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
				console.log("Updated content: ", updatedContent);
			} 
		});
	}

	// Main processing function to handle unit conversion
	processContent(content: string): string {
		const words = this.splitTextBySpace(content);

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
				const filteredValue = rawValue.replace(/(\r\n|\n|\r)/gm, "");
				value = parseFloat(filteredValue);
			} catch (_) {
				continue;
			}

			if (isNaN(value)) {
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

}
