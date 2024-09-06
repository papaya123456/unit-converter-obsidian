import { Editor, Plugin } from "obsidian";

// Define the main plugin class
export default class MyPlugin extends Plugin {
	// Called when the plugin is loaded
	async onload() {
		// Convert units in the active file when the plugin is loaded
		this.readActiveFileAndConvertUnits();

		// Set up an event listener for editor changes
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			this.convertUnitsInContent(content);
		});

		// Set up an event listener for active leaf changes
		this.app.workspace.on("active-leaf-change", () => {
			this.readActiveFileAndConvertUnits();
		});
	}

	// Read the active file and convert units
	async readActiveFileAndConvertUnits() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);
			this.convertUnitsInContent(content);
		}
	}

	// Convert units in the provided content and update the file
	async convertUnitsInContent(content: string) {
		const updatedContent = this.convertToMetric(content);
		const file = this.app.workspace.getActiveFile();
		if (file) {
			await this.app.vault.modify(file, updatedContent);
		}
	}

	// Convert imperial units in the content to metric units
	convertToMetric(content: string): string {
		const intOrFloat = '([0-9]+([,\\.][0-9]+)?)';
		const unitSuffix = '([^a-zA-Z]|$)';

		// Define the units to convert and their conversion multipliers
		const toConvert = [
			{ regex: new RegExp('(' + intOrFloat + ' ?mi(les?)?)' + unitSuffix, 'ig'), unit: 'km', multiplier: 1.60934 },
			{ regex: new RegExp('(' + intOrFloat + ' ?f(ee|oo)?t)' + unitSuffix, 'ig'), unit: 'm', multiplier: 0.3048 },
			{ regex: new RegExp('(' + intOrFloat + ' ?yards)' + unitSuffix, 'ig'), unit: 'm', multiplier: 0.9144 },
			{ regex: new RegExp('(' + intOrFloat + ' ?(pound|lb)s?)' + unitSuffix, 'ig'), unit: 'kg', multiplier: 0.453592 },
			{ regex: new RegExp('(' + intOrFloat + ' ?gallons?)' + unitSuffix, 'ig'), unit: 'L', multiplier: 3.78541 },
			{ regex: new RegExp('(' + intOrFloat + ' ?stones?)' + unitSuffix, 'ig'), unit: 'kg', multiplier: 6.35029 },
			{ regex: new RegExp('(' + intOrFloat + ' ?inch(es)?)' + unitSuffix, 'ig'), unit: 'cm', multiplier: 2.54 },
		];

		// Convert the original amount using the provided multiplier
		function convert(originalAmount: string, multiplier: number) {
			const amount = parseFloat(originalAmount);
			let convertedAmount = amount * multiplier;
			convertedAmount = Math.round(convertedAmount * 100) / 100;
			return convertedAmount;
		}

		// Generate the converted string for output
		function convertForOutput(originalAmount: string, unitIndex: number) {
			const multiplier = toConvert[unitIndex].multiplier;
			const unit = toConvert[unitIndex].unit;
			originalAmount = originalAmount.replace(/,/g, '');
			const convertedAmount = convert(originalAmount, multiplier);
			const convertedString = ` (${convertedAmount} ${unit})`;
			return convertedString;
		}

		function convertSimpleUnits(text: string) {
			const len = toConvert.length;
			for (let i = 0; i < len; i++) {
			    if (text.search(toConvert[i].regex) !== -1) {
					let matches;
					while ((matches = toConvert[i].regex.exec(text)) !== null) {
					const fullMatch = matches[1];
					const originalAmount = matches[2];
					const convertedString = convertForOutput(originalAmount, i);
					const insertIndex = matches.index + fullMatch.length;
					
					// Check if the conversion has already happened directly after the text
					const followingText = text.substring(insertIndex, insertIndex + convertedString.length);
					if (followingText !== convertedString) {
						text = insertAt(text, convertedString, insertIndex);
						}
					}
				}
			}
			return text;
		}
		
		function insertAt(text: string, insert: string, index: number) {
			return text.slice(0, index - 1) + insert + text.slice(index);
		}

		// Convert feet and inches to meters and append the converted value to the text
		function feetAndInchesToMeter(text: string) {
			const matches = text.match(/([0-9]{0,3})'([0-9][0-2]?)"/);
			if (matches) {
				const original = matches[0];
				const feet: number = parseInt(matches[1]);
				const inches: number = parseInt(matches[2]);
				let meter = (feet * 0.3048) + (inches * 0.0254);
				meter = Math.round(meter * 100) / 100;
				meter = parseFloat(meter.toFixed(2));
				text = text.replace(new RegExp('(' + original + ')'), '$1 (' + meter + ')');
			}
			return text;
		}

		// Convert simple units and feet/inches to metric in the content
		content = convertSimpleUnits(content);
		content = feetAndInchesToMeter(content);
		return content;
	}
}
