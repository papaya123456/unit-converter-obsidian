import { Plugin } from "obsidian";
import { unitsCheckForConversion } from "./src/conversions";

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
			const i = 2;

			// Print each word with its corresponding index and insert a string after the specific condition
			this.printAndInsertAfter(words, i, convertedUnit);
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

	// Function to check for units in the content and return the match if found
	checkForUnits(content: string): string | null {
		let foundMatch: string | null = null;
		// Iterate over each conversion pattern
		unitsCheckForConversion.forEach(({ regex }) => {
			const matches = content.match(regex);
			if (matches) {
				foundMatch = matches[0]; // Assuming we take the first match
				console.log(`Found match: "${foundMatch}"`);
			}
		});
		return foundMatch;
	}

	// Function to check if the unit has already been converted
	unitAlreadyConverted(content: string, match: string): boolean {
		// Regular expression to check for the match followed by brackets with a number or float
		const regex = new RegExp(`${match}\\s*\\(\\s*\\d+(\\.\\d+)?\\s*\\)`);
		
		// Check if the content matches the regex and return the result as a boolean
		return regex.test(content);
	}

		// Function to convert units if not already converted
		convertUnitsIfNecessary(content: string): string {
			let updatedContent = content;
	
			// Iterate over each conversion pattern
			unitsCheckForConversion.forEach(({ regex, conversionFunction }) => {
				const matches = content.match(regex);
				if (matches) {
					const match = matches[0];
					if (!this.unitAlreadyConverted(content, match)) {
						// Perform the conversion using the provided conversion function
						const convertedValue = conversionFunction(match);
						// Replace the match with the converted value in the format "match (convertedValue)"
						updatedContent = updatedContent.replace(match, `${match} (${convertedValue})`);
						console.log(`Converted "${match}" to "${convertedValue}"`);
					}
				}
			});
	
			return updatedContent;
		}




	// conversionCondition
	
	// Function to convert the unit to the target unit if all conditions are met & Function to insert the converted unit back into the text
	
	// Checker Klasse - Wörter werden als Parameter gespeichert und können dann auf bestimmte Muster geprüft werden
	
	// specialty cooking units
	
	startConversionProcess(content: string, unitName: string): void {
		const conversionCondition = checkForUnits(content) && !unitAlreadyConverted(content, unitName);
	
		if (conversionCondition) {
			// Your conversion logic here
			console.log("Conversion condition is positive. Proceed with conversion.");
			// Add your conversion logic here
		} else {
			console.log("Conversion condition is not met.");
		}
	}
	
	// Call the startConversionProcess function with the appropriate arguments

	// Function to convert the unit to the target unit if all conditions are met & Function to insert the converted unit back into the text

	// Checker Klasse - Wörter werden als Parameter gespeichert und können dann auf bestimmte Muster geprüft werden

	// specialty cooking units
}